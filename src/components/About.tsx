import styled from "styled-components";

interface AboutProps {
  onClose: () => void;
}

function About({ onClose }: AboutProps) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>서비스 소개</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ModalBody>
          <HeroSection>
            <HeroIcon>🎙️</HeroIcon>
            <HeroTitle>Daily News Podcast</HeroTitle>
            <HeroSubtitle>AI가 요약한 오늘의 뉴스를 들어보세요</HeroSubtitle>
          </HeroSection>

          <Section>
            <SectionTitle>📰 서비스 소개</SectionTitle>
            <SectionContent>
              Daily News Podcast는 매일 발행되는 주요 뉴스를 AI 기술을 활용하여
              요약하고, 자연스러운 음성으로 변환하여 제공하는 서비스입니다.
              <br />
              <br />
              바쁜 일상 속에서 뉴스를 읽을 시간이 없는 분들을 위해, 출퇴근길이나
              운동 중에도 쉽게 들을 수 있는 오디오 형태로 뉴스를 제공합니다.
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>✨ 주요 특징</SectionTitle>
            <FeatureGrid>
              <FeatureCard>
                <FeatureIcon>🤖</FeatureIcon>
                <FeatureTitle>AI 뉴스 요약</FeatureTitle>
                <FeatureDescription>
                  최신 AI 기술로 핵심 내용만 간결하게 요약
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🎧</FeatureIcon>
                <FeatureTitle>음성 변환</FeatureTitle>
                <FeatureDescription>
                  자연스러운 음성으로 편하게 청취
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📅</FeatureIcon>
                <FeatureTitle>매일 업데이트</FeatureTitle>
                <FeatureDescription>
                  매일 새로운 뉴스 요약 제공
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📱</FeatureIcon>
                <FeatureTitle>어디서든 접속</FeatureTitle>
                <FeatureDescription>
                  PC, 모바일 어디서든 이용 가능
                </FeatureDescription>
              </FeatureCard>
            </FeatureGrid>
          </Section>

          <Section>
            <SectionTitle>⚠️ 유의사항</SectionTitle>
            <NoticeBox>
              <NoticeItem>
                <NoticeIcon>ℹ️</NoticeIcon>
                <NoticeText>
                  본 서비스는 AI 기술을 활용하여 뉴스를 요약합니다. AI의 특성상
                  일부 오류가 있을 수 있습니다.
                </NoticeText>
              </NoticeItem>
              <NoticeItem>
                <NoticeIcon>📋</NoticeIcon>
                <NoticeText>
                  제공되는 콘텐츠는 참고용이며, 정확한 정보는 원본 뉴스 출처를
                  확인해 주세요.
                </NoticeText>
              </NoticeItem>
              <NoticeItem>
                <NoticeIcon>🗣️</NoticeIcon>
                <NoticeText>
                  AI 한국어 음성 기술은 아직 발전 중이며, 일부 발음이
                  부자연스러울 수 있습니다.
                </NoticeText>
              </NoticeItem>
            </NoticeBox>
          </Section>

          <Section>
            <SectionTitle>📬 문의하기</SectionTitle>
            <SectionContent>
              서비스 이용 중 문의사항이나 피드백이 있으시면 아래 이메일로 연락해
              주세요.
            </SectionContent>
            <ContactBox>
              <ContactIcon>✉️</ContactIcon>
              <ContactEmail href="mailto:contact@dailynewspod.com">
                contact@dailynewspod.com
              </ContactEmail>
            </ContactBox>
          </Section>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default About;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    border-radius: 16px;
    max-height: 90vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const HeroIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #6b7280;
`;

const Section = styled.section`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const SectionContent = styled.div`
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`;

const FeatureTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
`;

const FeatureDescription = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.5;
`;

const NoticeBox = styled.div`
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NoticeItem = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

const NoticeIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`;

const NoticeText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.5;
`;

const ContactBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
`;

const ContactIcon = styled.span`
  font-size: 1.25rem;
`;

const ContactEmail = styled.a`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

