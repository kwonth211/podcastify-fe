import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BASE_URL = "https://dailynewspod.com";

// 정적 페이지들
const STATIC_PAGES = [
  { url: "/", changefreq: "daily", priority: "1.0" },
  { url: "/about", changefreq: "monthly", priority: "0.8" },
  { url: "/contact", changefreq: "monthly", priority: "0.7" },
  { url: "/privacy", changefreq: "monthly", priority: "0.5" },
  { url: "/terms", changefreq: "monthly", priority: "0.5" },
];

// R2 클라이언트 설정
function createR2Client() {
  const endpoint = process.env.VITE_R2_ENDPOINT;
  const accessKeyId = process.env.VITE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.VITE_R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.log("⚠️ R2 credentials not found in .env file");
    console.log(
      "   Set VITE_R2_ENDPOINT, VITE_R2_ACCESS_KEY_ID, VITE_R2_SECRET_ACCESS_KEY"
    );
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

// 파일 키에서 날짜 추출
function extractDateFromKey(key) {
  const fileName = key.split("/").pop() || key;

  // {월}-{ID}_podcast_YYYYMMDD.mp3 형식 찾기
  const podcastDateMatch = fileName.match(
    /podcast_(\d{4})(\d{2})(\d{2})\.mp3$/
  );
  if (podcastDateMatch) {
    return `${podcastDateMatch[1]}-${podcastDateMatch[2]}-${podcastDateMatch[3]}`;
  }

  // YYYY-MM-DD 형식 찾기
  const yyyyMMddMatch = key.match(/(\d{4}-\d{2}-\d{2})/);
  if (yyyyMMddMatch) {
    return yyyyMMddMatch[1];
  }

  return "";
}

async function fetchPodcastList() {
  const r2Client = createR2Client();

  if (!r2Client) {
    return [];
  }

  const bucketName = process.env.VITE_R2_BUCKET_NAME;
  if (!bucketName) {
    console.log("⚠️ VITE_R2_BUCKET_NAME not set");
    return [];
  }

  try {
    console.log(`📡 Fetching podcast list from R2 bucket: ${bucketName}`);

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
    });

    const response = await r2Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      console.log("⚠️ No files found in bucket");
      return [];
    }

    // MP3 파일만 필터링
    const mp3Files = response.Contents.filter(
      (item) => item.Key && item.Key.endsWith(".mp3")
    );

    const podcasts = mp3Files
      .map((item) => ({
        key: item.Key,
        date: extractDateFromKey(item.Key),
      }))
      .filter((item) => item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log(`📻 Found ${podcasts.length} podcasts`);
    return podcasts;
  } catch (error) {
    console.error("❌ Error fetching podcast list:", error.message);
    return [];
  }
}

function generateSitemapXML(staticPages, podcasts) {
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // 정적 페이지 추가
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // 대본 페이지 추가
  for (const podcast of podcasts) {
    const encodedKey = encodeURIComponent(podcast.key);
    xml += `  <url>
    <loc>${BASE_URL}/transcript/${encodedKey}</loc>
    <lastmod>${podcast.date}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }

  xml += `</urlset>
`;

  return xml;
}

async function generateSitemap() {
  console.log("🗺️ Generating sitemap...\n");

  // 팟캐스트 목록 가져오기
  const podcasts = await fetchPodcastList();

  // Sitemap XML 생성
  const sitemapXML = generateSitemapXML(STATIC_PAGES, podcasts);

  // dist 폴더에 저장 (빌드 후 실행되므로 dist만 있으면 됨)
  const distDir = path.resolve(__dirname, "../dist");

  if (!fs.existsSync(distDir)) {
    console.error("❌ dist folder not found. Run 'npm run build' first.");
    process.exit(1);
  }

  const distPath = path.join(distDir, "sitemap.xml");
  fs.writeFileSync(distPath, sitemapXML);
  console.log(`✅ Saved: ${distPath}`);

  console.log(`\n📊 Total URLs: ${STATIC_PAGES.length + podcasts.length}`);
  console.log(`   - Static pages: ${STATIC_PAGES.length}`);
  console.log(`   - Transcript pages: ${podcasts.length}`);
  console.log("\n🎉 Sitemap generation complete!");
}

generateSitemap();
