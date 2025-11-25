# Daily News Podcast

데일리 뉴스를 팟캐스트로 들을 수 있는 웹 애플리케이션입니다.

## 기술 스택

- **React** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Yarn** - 패키지 매니저
- **Styled Components** - CSS-in-JS 스타일링
- **CloudFlare R2** - 오디오 파일 저장소
- **GitHub Actions** - CI/CD

## 기능

- 📅 날짜별 팟캐스트 목록 조회
- 🎵 오디오 플레이어를 통한 팟캐스트 재생
- 📥 CloudFlare R2에서 오디오 파일 다운로드

## 시작하기

### 1. 의존성 설치

```bash
yarn install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
VITE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
VITE_R2_ACCESS_KEY_ID=your-access-key-id
VITE_R2_SECRET_ACCESS_KEY=your-secret-access-key
VITE_R2_BUCKET_NAME=your-bucket-name
```

### 3. 개발 서버 실행

```bash
yarn dev
```

### 4. 빌드

```bash
yarn build
```

## CloudFlare R2 설정

1. CloudFlare R2 버킷 생성
2. R2 API 토큰 생성 (Access Key ID, Secret Access Key)
3. 버킷에 오디오 파일 업로드 (예: `podcasts/2024-01-15.mp3` 형식)

## 배포

배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md) 파일을 참고하세요.

### 빠른 시작

1. **Cloudflare Pages 프로젝트 생성**
   - Cloudflare Dashboard → Workers & Pages → Pages
   - GitHub 저장소 연결 또는 GitHub Actions 사용

2. **GitHub Secrets 설정**
   - [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) 참고

3. **환경 변수 설정**
   - Cloudflare Pages 대시보드에서 `VITE_R2_PUBLIC_URL` 설정

4. **배포**
   - `main` 브랜치에 push하면 자동 배포됩니다.

### 필수 Secrets

**R2 설정 (빌드용 - 서버 사이드 전용)**
- `VITE_R2_ENDPOINT` - R2 엔드포인트 URL
- `VITE_R2_BUCKET_NAME` - 버킷 이름
- `VITE_R2_ACCESS_KEY_ID` - 빌드용 읽기 전용 Access Key ID
- `VITE_R2_SECRET_ACCESS_KEY` - 빌드용 읽기 전용 Secret Access Key

**Cloudflare Pages 배포**
- `CLOUDFLARE_API_TOKEN` - Cloudflare API 토큰
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 계정 ID

### 선택적 Secrets

- `VITE_R2_PUBLIC_URL` - Public Development URL (런타임용)

⚠️ **보안 주의**: 빌드용 토큰은 클라이언트 코드에 포함되지 않으며, 빌드 시에만 사용됩니다.

## 프로젝트 구조

```
src/
  ├── components/       # React 컴포넌트
  │   ├── AudioPlayer.tsx
  │   └── PodcastList.tsx
  ├── utils/           # 유틸리티 함수
  │   └── r2Client.ts  # CloudFlare R2 클라이언트
  ├── styles/          # 전역 스타일
  │   └── GlobalStyle.ts
  ├── types/           # TypeScript 타입 정의
  │   └── index.ts
  ├── App.tsx          # 메인 앱 컴포넌트
  └── main.tsx         # 진입점
```

## 라이선스

MIT
