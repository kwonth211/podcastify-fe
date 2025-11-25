import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { PodcastFile } from "../types";

// CloudFlare R2 설정
// ⚠️ 주의: 클라이언트에서는 Public URL만 사용합니다.
// Access Key는 빌드 시에만 사용되며, 클라이언트 코드에 포함되지 않습니다.

const BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
const PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

// 빌드 시에만 사용되는 R2 클라이언트 (서버 사이드)
// 클라이언트에서는 사용하지 않음
const r2Client =
  import.meta.env.VITE_R2_ENDPOINT &&
  import.meta.env.VITE_R2_ACCESS_KEY_ID &&
  import.meta.env.VITE_R2_SECRET_ACCESS_KEY
    ? new S3Client({
        region: "auto",
        endpoint: import.meta.env.VITE_R2_ENDPOINT,
        credentials: {
          accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
          secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
        },
      })
    : null;

/**
 * R2에서 오디오 파일 목록 가져오기
 * ⚠️ 주의: 현재는 빌드 시에만 작동합니다.
 * 프로덕션에서는 백엔드 API를 통해 파일 목록을 가져와야 합니다.
 * @returns {Promise<PodcastFile[]>} 오디오 파일 목록
 */
export async function listAudioFiles(): Promise<PodcastFile[]> {
  if (!r2Client) {
    return [];
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME!,
    });

    const response = await r2Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }

    const mp3Files = response.Contents.filter(
      (item) => item.Key && item.Key.endsWith(".mp3")
    );

    return mp3Files
      .map((item) => ({
        key: item.Key!,
        date: extractDateFromKey(item.Key!, item.LastModified),
        size: item.Size,
        lastModified: item.LastModified,
      }))
      .filter((item) => item.date)
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
          return dateB - dateA;
        }
        const modA = a.lastModified?.getTime() || 0;
        const modB = b.lastModified?.getTime() || 0;
        return modB - modA;
      });
  } catch (error) {
    console.error("Error listing audio files:", error);
    throw error;
  }
}

/**
 * 오디오 파일의 URL 가져오기
 * Public URL이 설정되어 있으면 사용하고, 없으면 서명된 URL 생성
 * ⚠️ 주의: 클라이언트에서는 Public URL만 사용합니다.
 * @param {string} key - 파일 키
 * @returns {Promise<string>} 오디오 파일 URL
 */
export async function getAudioUrl(key: string): Promise<string> {
  // Public Development URL이 설정되어 있으면 사용 (권장)
  if (PUBLIC_URL) {
    // Public URL은 버킷 루트를 가리키므로 key 전체를 사용
    return `${PUBLIC_URL}/${key}`;
  }

  // Public URL이 없으면 서명된 URL 생성 (빌드 시에만 작동)
  if (!r2Client) {
    throw new Error(
      "R2 클라이언트가 초기화되지 않았고 Public URL도 설정되지 않았습니다."
    );
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME!,
      Key: key,
    });

    // 1시간 동안 유효한 URL 생성
    const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error getting audio URL:", error);
    throw error;
  }
}

/**
 * 파일 키에서 날짜 추출
 * 파일명 형식: {월}-{ID}_podcast_YYYYMMDD.mp3 (예: 11-19660025445_podcast_20251125.mp3)
 * @param {string} key - 파일 키
 * @param {Date | undefined} lastModified - 파일 수정 날짜 (fallback용)
 * @returns {string} 날짜 문자열 (YYYY-MM-DD)
 */
function extractDateFromKey(key: string, lastModified?: Date): string {
  // 파일명에서 직접 추출 (루트에 있으므로 접두사 제거 불필요)
  const fileName = key.split("/").pop() || key;

  // {월}-{ID}_podcast_YYYYMMDD.mp3 형식 찾기
  // 예: 11-19660025445_podcast_20251125.mp3
  const podcastDateMatch = fileName.match(
    /podcast_(\d{4})(\d{2})(\d{2})\.mp3$/
  );
  if (podcastDateMatch) {
    const year = podcastDateMatch[1];
    const month = podcastDateMatch[2];
    const day = podcastDateMatch[3];
    return `${year}-${month}-${day}`;
  }

  // YYYY-MM-DD 형식 찾기 (기존 형식 지원)
  const yyyyMMddMatch = key.match(/(\d{4}-\d{2}-\d{2})/);
  if (yyyyMMddMatch) {
    return yyyyMMddMatch[1];
  }

  // Modified 날짜가 있으면 사용 (fallback)
  if (lastModified) {
    const year = lastModified.getFullYear();
    const month = String(lastModified.getMonth() + 1).padStart(2, "0");
    const day = String(lastModified.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // 날짜를 찾을 수 없으면 빈 문자열 반환
  return "";
}
