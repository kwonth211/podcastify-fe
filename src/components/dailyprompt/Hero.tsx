import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { signInWithGoogle, isAuthenticated } from "../../utils/googleAuth";
import { ScrollReveal } from "../common/ScrollReveal";
import AudioPlayer from "../common/AudioPlayer";
import { MicrophoneIcon } from "../common/Icons";

const blobAnimation = keyframes`
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
`;

const HeroSection = styled.div`
  position: relative;
  padding-top: 8rem;
  padding-bottom: 5rem;
  overflow: hidden;
  background: white;

  @media (min-width: 1024px) {
    padding-top: 12rem;
    padding-bottom: 8rem;
  }
`;

const Blob = styled.div<{ delay?: string }>`
  position: absolute;
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: ${blobAnimation} 7s infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  mix-blend-mode: multiply;
`;

const BlueBlob = styled(Blob)`
  top: 0;
  left: -1rem;
  background: #dbeafe;
`;

const IndigoBlob = styled(Blob)`
  top: 0;
  right: -1rem;
  background: #e0e7ff;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  text-align: center;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #eef2ff;
  color: #4338ca;
  margin-bottom: 2rem;
  border: 1px solid #e0e7ff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const BadgeIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  color: #4f46e5;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: #111827;
  margin-bottom: 1.5rem;
  line-height: 1.1;

  @media (min-width: 1024px) {
    font-size: 4.5rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(to right, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  max-width: 42rem;
  margin: 0 auto 2.5rem;
  font-size: 1.25rem;
  color: #4b5563;
  line-height: 1.75;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const PrimaryButton = styled.button`
  padding: 1rem 2rem;
  background: #4f46e5;
  color: white;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.2s;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #4338ca;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: 1rem 2rem;
  background: white;
  color: #374151;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PlayerMockup = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  background: #111827;
  border-radius: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #1f2937;
  overflow: hidden;
  padding: 0.25rem;
  padding-top: 0.25rem;
`;

const PlayerContent = styled.div`
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(12px);
  padding: 2rem;
  border-radius: 2.2rem;
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PlayerIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: linear-gradient(to bottom right, #3b82f6, #4f46e5);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
`;

const PlayerText = styled.div`
  text-align: left;
`;

const PlayerTitle = styled.h3`
  color: white;
  font-weight: bold;
  font-size: 1.125rem;
`;

const PlayerSubtitle = styled.p`
  color: #818cf8;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Waveform = styled.div`
  display: none;
  gap: 0.25rem;
  height: 2rem;
  align-items: flex-end;

  @media (min-width: 640px) {
    display: flex;
  }
`;

const WaveBar = styled.div<{ height: number; delay: number }>`
  width: 0.25rem;
  background: #6366f1;
  border-radius: 9999px;
  animation: pulse 1.5s infinite;
  animation-delay: ${(props) => props.delay}ms;
  height: ${(props) => props.height * 100}%;
`;

const QuoteBox = styled.div`
  background: rgba(17, 24, 39, 0.5);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
  border: 1px solid rgba(55, 65, 81, 0.5);
`;

const QuoteText = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  font-style: italic;
`;

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const waveformHeights = [0.5, 1, 0.7, 1.4, 0.9, 1.2, 0.6, 1.3];

  const handleAction = async () => {
    // 이미 로그인되어 있으면 바로 이동
    if (isAuthenticated()) {
      navigate("/generate");
      return;
    }

    // 로그인되어 있지 않으면 로그인 진행
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // 로그인 성공 시 generate 페이지로 이동
      navigate("/generate");
    } catch (error) {
      console.error("Google 로그인 실패:", error);
      alert(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleListenExample = () => {
    // 플레이어 섹션으로 스크롤
    setTimeout(() => {
      const playerElement = document.getElementById("player-mockup");
      if (playerElement) {
        playerElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleGetStarted = handleAction;

  return (
    <HeroSection>
      <BlueBlob />
      <IndigoBlob delay="2000ms" />

      <Container>
        <ScrollReveal animation="fadeDown" delay={0}>
          <Badge>
            <BadgeIcon>
              <MicrophoneIcon size={16} />
            </BadgeIcon>
            {t("hero.badge")}
          </Badge>
        </ScrollReveal>
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <Title>
            {t("hero.titleLine1")}
            <br />
            <GradientText>{t("hero.titleLine2")}</GradientText>
          </Title>
        </ScrollReveal>
        <ScrollReveal animation="fadeUp" delay={0.2}>
          <Description>{t("hero.description")}</Description>
        </ScrollReveal>
        <ScrollReveal animation="fadeUp" delay={0.3}>
          <ButtonGroup>
            <PrimaryButton onClick={handleGetStarted} disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
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
                  <span>{t("hero.loggingIn")}</span>
                </>
              ) : (
                <>
                  <span>{t("hero.getStartedFree")}</span>
                </>
              )}
            </PrimaryButton>
            <SecondaryButton onClick={handleListenExample} disabled={isLoading}>
              {t("hero.listenToExample")}
            </SecondaryButton>
          </ButtonGroup>
        </ScrollReveal>

        <ScrollReveal animation="scaleUp" delay={0.4}>
          <PlayerMockup id="player-mockup">
            <PlayerContent>
              <PlayerHeader>
                <PlayerInfo>
                  <PlayerIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </PlayerIcon>
                  <PlayerText>
                    <PlayerTitle>{t("hero.playerTitle")}</PlayerTitle>
                    <PlayerSubtitle>{t("hero.playerSubtitle")}</PlayerSubtitle>
                  </PlayerText>
                </PlayerInfo>
                <Waveform>
                  {waveformHeights.map((h, i) => (
                    <WaveBar key={i} height={h} delay={i * 150} />
                  ))}
                </Waveform>
              </PlayerHeader>
              <QuoteBox>
                <QuoteText>"{t("hero.playerQuote")}"</QuoteText>
              </QuoteBox>
              <div style={{ marginTop: "1.5rem" }}>
                <AudioPlayer
                  src={
                    i18n.language === "en" || i18n.language.startsWith("en")
                      ? "/apple_example.mp3"
                      : "/google_example_kr.mp3"
                  }
                  title=""
                  dark={true}
                />
              </div>
            </PlayerContent>
          </PlayerMockup>
        </ScrollReveal>
      </Container>
    </HeroSection>
  );
};

export default Hero;
