import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { PodcastFile } from "../types";

// CloudFlare R2 설정
const r2Client = new S3Client({
  region: "auto",
  endpoint: import.meta.env.VITE_R2_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;

/**
 * R2에서 오디오 파일 목록 가져오기
 * @returns {Promise<PodcastFile[]>} 오디오 파일 목록
 */
export async function listAudioFiles(): Promise<PodcastFile[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "podcasts/", // podcasts 폴더의 파일들만 가져오기
    });

    const response = await r2Client.send(command);

    if (!response.Contents) {
      return [];
    }

    // 날짜별로 정렬 (최신순)
    return response.Contents.filter(
      (item) => item.Key && item.Key.endsWith(".mp3")
    )
      .map((item) => ({
        key: item.Key!,
        date: extractDateFromKey(item.Key!),
        size: item.Size,
        lastModified: item.LastModified,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error listing audio files:", error);
    throw error;
  }
}

/**
 * 오디오 파일의 서명된 URL 가져오기
 * @param {string} key - 파일 키
 * @returns {Promise<string>} 서명된 URL
 */
export async function getAudioUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
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
 * @param {string} key - 파일 키 (예: podcasts/2024-01-15.mp3)
 * @returns {string} 날짜 문자열 (YYYY-MM-DD)
 */
function extractDateFromKey(key: string): string {
  const match = key.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

