import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { HelmetProvider } from "react-helmet-async";
import GlobalStyle from "./styles/GlobalStyle";
import {
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  MyPodcastsPage,
  PodcastDetailPage,
  GeneratePage,
  PricingPage,
  SchedulerPage,
} from "./components/pages";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import GoogleAuthCallback from "./components/auth/GoogleAuthCallback";
import Navbar from "./components/dailyprompt/Navbar";
import Hero from "./components/dailyprompt/Hero";
import Features from "./components/dailyprompt/Features";
import InteractiveDemo from "./components/dailyprompt/InteractiveDemo";
import NewsCreator from "./components/dailyprompt/NewsCreator";
import Pricing from "./components/dailyprompt/Pricing";
import Footer from "./components/dailyprompt/Footer";
import MobileCTA from "./components/dailyprompt/MobileCTA";

const theme = {
  colors: {
    primary: "#4f46e5",
    secondary: "#2563eb",
    background: "#f9fafb",
    text: "#111827",
    textLight: "#4b5563",
  },
};

function DailyNewsPodcastHome() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <InteractiveDemo />
        <NewsCreator />
        <Pricing />
        <Footer />
      </main>
      <MobileCTA />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <SubscriptionProvider>
          <BrowserRouter>
            <GlobalStyle />
            <Routes>
              <Route path="/" element={<DailyNewsPodcastHome />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/my-podcasts" element={<MyPodcastsPage />} />
              <Route path="/my-podcasts/:id" element={<PodcastDetailPage />} />
              <Route path="/generate" element={<GeneratePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/scheduler" element={<SchedulerPage />} />
              <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
            </Routes>
          </BrowserRouter>
        </SubscriptionProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
