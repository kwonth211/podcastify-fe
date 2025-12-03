import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // iOS 체크
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // 이미 설치된 앱인지 체크
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    if (isStandalone) {
      return; // 이미 PWA로 실행 중이면 표시하지 않음
    }

    // 설치 거부 후 7일 동안 표시 안함
    const dismissedAt = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const now = new Date();
      const daysDiff =
        (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < 7) {
        return;
      }
    }

    // Android/Chrome: beforeinstallprompt 이벤트 리스닝
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // 3초 후에 프롬프트 표시 (UX 개선)
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // iOS: 직접 안내 표시 (3초 후)
    if (isIOSDevice) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android/Chrome 설치
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // iOS 가이드 표시
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem("pwa-prompt-dismissed", new Date().toISOString());
  };

  if (!showPrompt) return null;

  return (
    <>
      <PromptContainer>
        <PromptContent>
          <IconWrapper>📱</IconWrapper>
          <TextContent>
            <Title>홈 화면에 추가하기</Title>
            <Description>
              앱처럼 빠르게 접속하고 오프라인에서도 이용하세요!
            </Description>
          </TextContent>
          <ButtonGroup>
            <InstallButton onClick={handleInstall}>
              {isIOS ? "방법 보기" : "설치하기"}
            </InstallButton>
            <DismissButton onClick={handleDismiss}>나중에</DismissButton>
          </ButtonGroup>
        </PromptContent>
      </PromptContainer>

      {showIOSGuide && (
        <IOSGuideOverlay onClick={handleDismiss}>
          <IOSGuideModal onClick={(e) => e.stopPropagation()}>
            <GuideTitle>iOS에서 홈 화면 추가하기</GuideTitle>
            <GuideSteps>
              <Step>
                <StepNumber>1</StepNumber>
                <StepText>
                  Safari 하단의 <ShareIcon>⬆️</ShareIcon> 공유 버튼을 탭하세요
                </StepText>
              </Step>
              <Step>
                <StepNumber>2</StepNumber>
                <StepText>
                  메뉴에서 <strong>"홈 화면에 추가"</strong>를 선택하세요
                </StepText>
              </Step>
              <Step>
                <StepNumber>3</StepNumber>
                <StepText>
                  오른쪽 상단의 <strong>"추가"</strong>를 탭하면 완료!
                </StepText>
              </Step>
            </GuideSteps>
            <GuideImage>
              <MockSafari>
                <MockAddButton>➕ 홈 화면에 추가</MockAddButton>
              </MockSafari>
            </GuideImage>
            <CloseButton onClick={handleDismiss}>확인</CloseButton>
          </IOSGuideModal>
        </IOSGuideOverlay>
      )}
    </>
  );
};

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const PromptContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 16px;
  animation: ${slideUp} 0.4s ease-out;
`;

const PromptContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 -4px 20px rgba(102, 126, 234, 0.4);
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const IconWrapper = styled.div`
  font-size: 32px;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h3`
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
    margin-top: 8px;
  }
`;

const InstallButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    flex: 1;
  }
`;

const DismissButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 480px) {
    flex: 1;
  }
`;

const IOSGuideOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const IOSGuideModal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  max-width: 340px;
  width: 100%;
  text-align: center;
`;

const GuideTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
`;

const GuideSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
`;

const StepNumber = styled.div`
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
`;

const StepText = styled.p`
  color: #555;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;

  strong {
    color: #333;
  }
`;

const ShareIcon = styled.span`
  display: inline-block;
  font-size: 16px;
`;

const GuideImage = styled.div`
  margin: 16px 0;
`;

const MockSafari = styled.div`
  background: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
`;

const MockAddButton = styled.div`
  background: white;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #007aff;
  font-weight: 500;
`;

const CloseButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default InstallPrompt;
