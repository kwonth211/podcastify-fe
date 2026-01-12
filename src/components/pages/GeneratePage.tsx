import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { BriefResponse } from "../../types/dailyprompt";
import Navbar from "../dailyprompt/Navbar";
import Footer from "../dailyprompt/Footer";
import { isAuthenticated } from "../../utils/googleAuth";
import { 
  PenIcon, 
  BrainIcon, 
  MicrophoneIcon, 
  SparkleIcon, 
  SaveIcon, 
  RefreshIcon,
  LightbulbIcon,
  CheckIcon
} from "../common/Icons";

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

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25%);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9fafb, #ffffff);
  padding-top: 4rem;
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem 6rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem 4rem;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 1.2fr 1fr;
    gap: 3rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(79, 70, 229, 0.2);
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
    background: #4f46e5;
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
    background: #4f46e5;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const SectionDesc = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  color: #111827;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: white;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

const GenerateButton = styled.button<{ disabled?: boolean }>`
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  background: ${(props) =>
    props.disabled
      ? "#d1d5db"
      : "linear-gradient(to right, #4f46e5, #6366f1)"};
  color: white;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -3px rgba(79, 70, 229, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
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
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  transition: all 0.2s;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: #4f46e5;
    border-color: #c7d2fe;
    background: #eef2ff;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TipsCard = styled.div`
  background: linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%);
  border: 1px solid #e0e7ff;
  border-radius: 1rem;
  padding: 1.5rem;
`;

const TipsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #4f46e5;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TipItem = styled.li`
  font-size: 0.875rem;
  color: #4b5563;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  line-height: 1.5;
`;

const TipIcon = styled.span`
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
`;

const ErrorMessage = styled.p`
  margin-top: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
`;

const RightColumn = styled.div`
  position: relative;
`;

const WorkflowCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.5rem;
  padding: 2rem;
  min-height: 500px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 6rem;
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
  background: linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  border: 1px solid #e5e7eb;
`;

const WorkflowSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const WorkflowStep = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)"
      : props.$completed
      ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
      : "#f9fafb"};
  border: 1px solid
    ${(props) =>
      props.$active
        ? "#c7d2fe"
        : props.$completed
        ? "#bbf7d0"
        : "#e5e7eb"};
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$active &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(to right, #4f46e5, #7c3aed);
        animation: ${pulse} 2s ease-in-out infinite;
      }
    `}
`;

const StepIcon = styled.div<{ $active?: boolean; $completed?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(to bottom right, #4f46e5, #7c3aed)"
      : props.$completed
      ? "linear-gradient(to bottom right, #22c55e, #16a34a)"
      : "#e5e7eb"};
  color: ${(props) =>
    props.$active || props.$completed ? "white" : "#9ca3af"};
  box-shadow: ${(props) =>
    props.$active || props.$completed
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      : "none"};
  position: relative;
  
  ${(props) =>
    props.$active &&
    css`
      &::before {
        content: "";
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #6366f1;
        border-right-color: #6366f1;
        animation: ${spin} 1s linear infinite;
        z-index: -1;
      }
      
      &::after {
        content: "";
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-bottom-color: #7c3aed;
        border-left-color: #7c3aed;
        animation: ${spin} 1s linear infinite reverse;
        z-index: -1;
      }
    `}
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
`;

const StepDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingDots = styled.span`
  display: inline-flex;
  gap: 0.25rem;
  
  &::after {
    content: "...";
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

const Spinner = styled.div<{ $size?: string }>`
  width: ${(props) => props.$size || "1rem"};
  height: ${(props) => props.$size || "1rem"};
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  flex-shrink: 0;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
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
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1.5rem;
`;

const ResultTitleSection = styled.div``;

const ResultLabel = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #6366f1;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
`;

const ResultTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: linear-gradient(to right, #4f46e5, #6366f1);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }
  `
      : `
    background: #f3f4f6;
    color: #4b5563;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const PlayButton = styled.button<{ playing?: boolean; disabled?: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  background: ${(props) =>
    props.playing
      ? "linear-gradient(to bottom right, #ef4444, #dc2626)"
      : "linear-gradient(to bottom right, #4f46e5, #7c3aed)"};
  color: white;
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
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
  max-height: 400px;
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
  padding: 1.25rem;
  border-radius: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;

  &:hover {
    background: white;
    border-color: #c7d2fe;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transform: translateX(4px);
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const CategoryTag = styled.span`
  font-size: 0.625rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #6366f1;
  background: #eef2ff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

const SourceText = styled.span`
  font-size: 0.625rem;
  color: #9ca3af;
`;

const ArticleTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
`;

const ArticleSummary = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;

type WorkflowStepType =
  | "idle"
  | "prompting"
  | "crawling"
  | "summarizing"
  | "generating"
  | "completed";

const GeneratePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [result, setResult] = useState<BriefResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [workflowStep, setWorkflowStep] = useState<WorkflowStepType>("idle");
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // 세션 확인
  useEffect(() => {
    if (!isAuthenticated()) {
      // 로그인되어 있지 않으면 홈으로 리다이렉트
      navigate("/");
    }
  }, [navigate]);

  const examples = [
    t("interactiveDemo.examples.stock"),
    t("interactiveDemo.examples.fusion"),
    t("interactiveDemo.examples.football"),
    t("interactiveDemo.examples.coffee"),
  ];

  const workflowStepsData = [
    {
      id: "prompting" as WorkflowStepType,
      icon: <PenIcon size={20} />,
      title: t("generate.workflow.prompting.title"),
      description: t("generate.workflow.prompting.description"),
    },
    {
      id: "crawling" as WorkflowStepType,
      icon: <BrainIcon size={20} />,
      title: t("generate.workflow.crawling.title"),
      description: t("generate.workflow.crawling.description"),
    },
    {
      id: "summarizing" as WorkflowStepType,
      icon: <SparkleIcon size={20} />,
      title: t("generate.workflow.summarizing.title"),
      description: t("generate.workflow.summarizing.description"),
    },
    {
      id: "generating" as WorkflowStepType,
      icon: <MicrophoneIcon size={20} />,
      title: t("generate.workflow.generating.title"),
      description: t("generate.workflow.generating.description"),
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setWorkflowStep("prompting");
    stopAudio();

    try {
      // 모킹: 프롬프트 분석 단계 (0.5초)
      await new Promise((resolve) => setTimeout(resolve, 500));
      setWorkflowStep("crawling");

      // 모킹: 웹 검색 단계 (2초)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setWorkflowStep("summarizing");

      // 모킹: 요약 정리 단계 (2.5초)
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setWorkflowStep("generating");

      // 모킹: 음성 파일 생성 단계 (3초)
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setWorkflowStep("completed");

      // 모킹 결과 생성
      const mockArticles = [
        {
          title: `${prompt} 관련 최신 뉴스`,
          summary: `${prompt}에 대한 최신 정보를 수집하여 요약했습니다. 주요 내용은 다음과 같습니다. 첫째, 관련 산업의 최근 동향과 변화를 확인했습니다. 둘째, 주요 이해관계자들의 반응과 의견을 분석했습니다. 셋째, 향후 전망과 예상되는 영향에 대해 정리했습니다.`,
          source: "AI 뉴스 에이전트",
          category: "NEWS",
        },
        {
          title: `${prompt} 관련 심층 분석`,
          summary: `더 깊이 있는 분석 결과, ${prompt}와 관련하여 여러 중요한 포인트를 발견했습니다. 전문가들은 이에 대해 다양한 의견을 제시하고 있으며, 시장의 반응도 주목할 만합니다.`,
          source: "AI 뉴스 에이전트",
          category: "ANALYSIS",
        },
        {
          title: `${prompt} 관련 추가 정보`,
          summary: `추가로 수집한 정보에 따르면, ${prompt}와 연관된 여러 부수적인 이슈들도 존재합니다. 이러한 정보들은 전체적인 맥락을 이해하는 데 도움이 될 것입니다.`,
          source: "AI 뉴스 에이전트",
          category: "INFO",
        },
      ];

      setResult({
        briefDate: new Date().toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        headline: `${prompt} - 맞춤형 뉴스 팟캐스트`,
        articles: mockArticles,
      });
    } catch (err) {
      console.error("Generate Error:", err);
      setError(
        err instanceof Error ? err.message : "팟캐스트 생성에 실패했습니다."
      );
      setWorkflowStep("idle");
    } finally {
      setLoading(false);
    }
  };

  const playSummaryAsPodcast = async () => {
    if (!result) return;
    setAudioLoading(true);
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

  const getCurrentStepIndex = () => {
    return workflowStepsData.findIndex((step) => step.id === workflowStep);
  };

  const handleSaveToDashboard = () => {
    // TODO: Save to dashboard
    navigate("/my-podcasts");
  };

  return (
    <Container>
      <Helmet>
        <title>{t("generate.pageTitle")} - DailyNewsPodcast</title>
        <meta name="description" content={t("generate.pageDescription")} />
      </Helmet>
      <Navbar />
      <Main>
        <PageHeader>
          <PageTitle>{t("generate.title")}</PageTitle>
          <PageSubtitle>{t("generate.subtitle")}</PageSubtitle>
        </PageHeader>

        <Grid>
          <LeftColumn>
            <FormCard>
              <Badge>
                <PulseDot />
                {t("generate.badge")}
              </Badge>
              <SectionTitle>{t("generate.formTitle")}</SectionTitle>
              <SectionDesc>{t("generate.formDescription")}</SectionDesc>
              <Form onSubmit={handleGenerate}>
                <InputWrapper>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t("interactiveDemo.placeholder")}
                    disabled={loading}
                    maxLength={500}
                  />
                  <CharCount>
                    {prompt.length}/500
                  </CharCount>
                </InputWrapper>
                  <GenerateButton
                    type="submit"
                    disabled={loading || !prompt.trim()}
                  >
                    {loading ? (
                      <>
                        <Spinner $size="1.25rem" />
                        {t("interactiveDemo.generating")}
                      </>
                    ) : (
                      <>
                        <SparkleIcon size={20} />
                        {t("interactiveDemo.generatePodcast")}
                      </>
                    )}
                  </GenerateButton>
                <Examples>
                  {examples.map((ex, idx) => (
                    <ExampleButton
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(ex)}
                      disabled={loading}
                    >
                      {ex}
                    </ExampleButton>
                  ))}
                </Examples>
              </Form>
              {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
            </FormCard>

            <TipsCard>
              <TipsTitle>
                <LightbulbIcon size={18} color="#4f46e5" />
                {t("generate.tipsTitle")}
              </TipsTitle>
              <TipsList>
                <TipItem>
                  <TipIcon><LightbulbIcon size={14} /></TipIcon>
                  {t("generate.tip1")}
                </TipItem>
                <TipItem>
                  <TipIcon><LightbulbIcon size={14} /></TipIcon>
                  {t("generate.tip2")}
                </TipItem>
                <TipItem>
                  <TipIcon><LightbulbIcon size={14} /></TipIcon>
                  {t("generate.tip3")}
                </TipItem>
              </TipsList>
            </TipsCard>
          </LeftColumn>

          <RightColumn>
            <WorkflowCard>
              {!result && !loading && workflowStep === "idle" && (
                <EmptyState>
                  <EmptyIcon>
                    <MicrophoneIcon size={40} color="#4f46e5" />
                  </EmptyIcon>
                  <div>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        marginBottom: "0.5rem",
                        color: "#111827",
                      }}
                    >
                      {t("generate.readyTitle")}
                    </p>
                    <p style={{ color: "#6b7280" }}>
                      {t("generate.readyDescription")}
                    </p>
                  </div>
                </EmptyState>
              )}

              {loading && (
                <LoadingState>
                  <WorkflowSteps>
                    {workflowStepsData.map((step, index) => {
                      const currentIndex = getCurrentStepIndex();
                      const isActive = step.id === workflowStep;
                      const isCompleted = currentIndex > index;

                      return (
                        <WorkflowStep
                          key={step.id}
                          $active={isActive}
                          $completed={isCompleted}
                        >
                          <StepIcon $active={isActive} $completed={isCompleted}>
                            {isCompleted ? <CheckIcon size={16} /> : step.icon}
                          </StepIcon>
                          <StepContent>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>
                              {isActive && <Spinner $size="0.75rem" />}
                              {step.description}
                              {isActive && <LoadingDots />}
                            </StepDescription>
                          </StepContent>
                        </WorkflowStep>
                      );
                    })}
                  </WorkflowSteps>
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

                  <ActionButtons>
                    <ActionButton $variant="primary" onClick={handleSaveToDashboard}>
                      <SaveIcon size={16} />
                      {t("generate.saveToDashboard")}
                    </ActionButton>
                    <ActionButton $variant="secondary" onClick={() => setResult(null)}>
                      <RefreshIcon size={16} />
                      {t("generate.startNew")}
                    </ActionButton>
                  </ActionButtons>

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
            </WorkflowCard>
          </RightColumn>
        </Grid>
      </Main>
      <Footer />
    </Container>
  );
};

export default GeneratePage;
