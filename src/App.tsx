import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { HelmetProvider } from "react-helmet-async";
import GlobalStyle from "./styles/GlobalStyle";
import { PlayerProvider } from "./contexts/PlayerContext";
import PodcastList from "./components/PodcastList";
import TranscriptPage from "./components/TranscriptPage";
import GlobalMiniPlayer from "./components/GlobalMiniPlayer";
import InstallPrompt from "./components/InstallPrompt";
import {
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
} from "./components/pages";
import {
  usePageTracking,
  useScrollDepthTracking,
  useOutboundLinkTracking,
} from "./hooks/useAnalytics";

const theme = {
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    background: "#f5f7fa",
    text: "#333",
    textLight: "#666",
  },
};

// Analytics 트래킹을 위한 래퍼 컴포넌트
// BrowserRouter 내부에서 location을 사용해야 하므로 별도 컴포넌트로 분리
function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  // 페이지뷰 자동 트래킹
  usePageTracking();
  // 스크롤 깊이 트래킹
  useScrollDepthTracking();
  // 외부 링크 클릭 트래킹
  useOutboundLinkTracking();

  return <>{children}</>;
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <PlayerProvider>
          <BrowserRouter>
            <AnalyticsWrapper>
              <GlobalStyle />
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <PodcastList />
                      <InstallPrompt />
                    </>
                  }
                />
                <Route path="/transcript/:key" element={<TranscriptPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Routes>
              <GlobalMiniPlayer />
            </AnalyticsWrapper>
          </BrowserRouter>
        </PlayerProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
