import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { BriefResponse } from "../../types/dailyprompt";
import { ScrollReveal } from "../common/ScrollReveal";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Section = styled.section`
  padding: 6rem 0;
  background: #030712;
  color: white;
  overflow: hidden;
  position: relative;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LeftColumn = styled.div``;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(59, 130, 246, 0.2);
  margin-bottom: 1.5rem;
`;

const PulseDot = styled.span`
  position: relative;
  display: flex;
  height: 0.5rem;
  width: 0.5rem;

  &::before {
    content: "";
    position: absolute;
    display: inline-flex;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    background: #60a5fa;
    opacity: 0.75;
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  &::after {
    content: "";
    position: relative;
    display: inline-flex;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    background: #3b82f6;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const SectionDesc = styled.p`
  font-size: 1.25rem;
  color: #9ca3af;
  margin-bottom: 2rem;
  line-height: 1.75;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }
`;

const GenerateButton = styled.button<{ disabled?: boolean }>`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  bottom: 0.5rem;
  padding: 0 1.5rem;
  border-radius: 0.75rem;
  font-weight: bold;
  transition: all 0.2s;
  background: ${(props) => (props.disabled ? "#374151" : "#4f46e5")};
  color: white;
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #6366f1;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const Examples = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 0.5rem;
`;

const ExampleButton = styled.button`
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  background: #111827;
  border: none;
  color: #9ca3af;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    color: #818cf8;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 1rem;
  color: #f87171;
  font-size: 0.875rem;
  font-weight: 500;
`;

const RightColumn = styled.div`
  position: relative;
`;

const Glow = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(99, 102, 241, 0.1);
  filter: blur(100px);
  border-radius: 50%;
  transition: all 0.7s;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
  }
`;

const ResultCard = styled.div`
  position: relative;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  padding: 2rem;
  min-height: 450px;
  border: 1px solid #1f2937;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const EmptyState = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  gap: 1.5rem;
`;

const EmptyIcon = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 1.5rem;
  background: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  border: 1px solid #374151;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  padding: 1rem;
`;

const LoadingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LoadingBar = styled.div`
  height: 1rem;
  background: #1f2937;
  border-radius: 0.5rem;
  width: 50%;
`;

const LoadingBox = styled.div`
  height: 6rem;
  background: #1f2937;
  border-radius: 1rem;
`;

const ResultContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const ResultHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1f2937;
  padding-bottom: 1.5rem;
`;

const ResultTitleSection = styled.div``;

const ResultLabel = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #818cf8;
  font-weight: bold;
  display: block;
  margin-bottom: 0.25rem;
`;

const ResultTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
`;

const PlayButton = styled.button<{ playing?: boolean; disabled?: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  background: ${(props) => (props.playing ? "#ef4444" : "white")};
  color: ${(props) => (props.playing ? "white" : "#111827")};
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${(props) => (props.playing ? "#dc2626" : "#f3f4f6")};
    transform: scale(0.9);
  }

  &:active:not(:disabled) {
    transform: scale(0.9);
  }
`;

const WaveformContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
`;

const WaveformBar = styled.div`
  width: 0.25rem;
  background: #6366f1;
  border-radius: 9999px;
  animation: bounce 0.5s infinite;
  height: 100%;
`;

const ArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.4);
  }
`;

const ArticleCard = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const CategoryTag = styled.span`
  font-size: 0.625rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #818cf8;
`;

const SourceText = styled.span`
  font-size: 0.625rem;
  color: #6b7280;
`;

const ArticleTitle = styled.h4`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ArticleSummary = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  line-height: 1.75;
`;

const InteractiveDemo: React.FC = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [result, setResult] = useState<BriefResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const examples = [
    t("interactiveDemo.examples.stock"),
    t("interactiveDemo.examples.fusion"),
    t("interactiveDemo.examples.football"),
    t("interactiveDemo.examples.coffee"),
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    stopAudio();

    try {
      const mock = "2025/01/09 사회";
      // 개발 환경에서는 프록시 사용, 프로덕션에서는 직접 호출
      const apiUrl = import.meta.env.DEV
        ? "/api/news"
        : "https://hooks.app.n8n.cloud/webhook-test/daily-news-podcast";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            language: "ko",
            prompt: mock,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // n8n webhook이 활성화되지 않은 경우
        if (
          response.status === 404 &&
          data.message?.includes("not registered")
        ) {
          throw new Error(
            "Webhook이 활성화되지 않았습니다. n8n에서 'Execute workflow' 버튼을 클릭하세요."
          );
        }
        throw new Error(
          data.message || `API request failed: ${response.status}`
        );
      }

      // API 응답을 BriefResponse 형식으로 변환
      setResult({
        briefDate: new Date().toLocaleDateString(),
        headline: data.headline || `Your Personalized News: ${prompt}`,
        articles: data.articles || [
          {
            title: data.title || "News Summary",
            summary: data.summary || data.content || JSON.stringify(data),
            source: data.source || "AI Generated",
            category: data.category || "NEWS",
          },
        ],
      });
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate podcast"
      );
    } finally {
      setLoading(false);
    }
  };

  const playSummaryAsPodcast = async () => {
    if (!result) return;
    setAudioLoading(true);
    // Mock implementation
    setTimeout(() => {
      setIsPlaying(true);
      setAudioLoading(false);
    }, 1000);
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  return (
    <Section id="demo">
      <Container>
        <Grid>
          <ScrollReveal animation="fadeRight">
            <LeftColumn>
              <Badge>
                <PulseDot />
                {t("interactiveDemo.badge")}
              </Badge>
              <SectionTitle>{t("interactiveDemo.title")}</SectionTitle>
              <SectionDesc>{t("interactiveDemo.description")}</SectionDesc>
              <Form onSubmit={handleGenerate}>
                <InputWrapper>
                  <Input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t("interactiveDemo.placeholder")}
                  />
                  <GenerateButton disabled={loading}>
                    {loading
                      ? t("interactiveDemo.generating")
                      : t("interactiveDemo.generatePodcast")}
                  </GenerateButton>
                </InputWrapper>
                <Examples>
                  {examples.map((ex, idx) => (
                    <ExampleButton
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(ex)}
                    >
                      {ex}
                    </ExampleButton>
                  ))}
                </Examples>
              </Form>
              {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
            </LeftColumn>
          </ScrollReveal>

          <ScrollReveal animation="fadeLeft" delay={0.2}>
            <RightColumn>
              <Glow />
              <ResultCard>
                {!result && !loading && (
                  <EmptyState>
                    <EmptyIcon>📻</EmptyIcon>
                    <div>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.25rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {t("interactiveDemo.readyForAir")}
                      </p>
                      <p style={{ color: "#6b7280" }}>
                        {t("interactiveDemo.readyDescription")}
                      </p>
                    </div>
                  </EmptyState>
                )}

                {loading && (
                  <LoadingState>
                    <LoadingItem>
                      <div
                        style={{
                          width: "3rem",
                          height: "3rem",
                          background: "#1f2937",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <LoadingBar />
                    </LoadingItem>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <LoadingBox />
                      <LoadingBox />
                      <LoadingBox />
                    </div>
                  </LoadingState>
                )}

                {result && (
                  <ResultContent>
                    <ResultHeader>
                      <ResultTitleSection>
                        <ResultLabel>
                          {t("interactiveDemo.customPodcast")}
                        </ResultLabel>
                        <ResultTitle>{result.headline}</ResultTitle>
                      </ResultTitleSection>
                      <PlayButton
                        onClick={isPlaying ? stopAudio : playSummaryAsPodcast}
                        disabled={audioLoading}
                        playing={isPlaying}
                      >
                        {audioLoading ? (
                          <svg
                            className="animate-spin"
                            width="24"
                            height="24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : isPlaying ? (
                          <svg
                            width="24"
                            height="24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </PlayButton>
                    </ResultHeader>

                    {isPlaying && (
                      <WaveformContainer>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <WaveformBar
                            key={i}
                            style={{
                              animationDuration: `${0.5 + Math.random()}s`,
                            }}
                          />
                        ))}
                      </WaveformContainer>
                    )}

                    <ArticlesList>
                      {result.articles.map((article, idx) => (
                        <ArticleCard key={idx}>
                          <ArticleMeta>
                            <CategoryTag>{article.category}</CategoryTag>
                            <SourceText>• {article.source}</SourceText>
                          </ArticleMeta>
                          <ArticleTitle>{article.title}</ArticleTitle>
                          <ArticleSummary>{article.summary}</ArticleSummary>
                        </ArticleCard>
                      ))}
                    </ArticlesList>
                  </ResultContent>
                )}
              </ResultCard>
            </RightColumn>
          </ScrollReveal>
        </Grid>
      </Container>
    </Section>
  );
};

export default InteractiveDemo;
