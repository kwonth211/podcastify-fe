import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { BriefResponse } from '../../types/dailyprompt';
import { isAuthenticated, signInWithGoogle } from '../../utils/googleAuth';
import { ScrollReveal } from '../common/ScrollReveal';

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
  background: rgba(238, 242, 255, 0.5);
`;

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
`;

const Card = styled.div`
  background: white;
  border-radius: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #eef2ff;
  overflow: hidden;
`;

const StepperHeader = styled.div`
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StepperContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepCircle = styled.div<{ active: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: bold;
  transition: all 0.2s;
  background: ${props => props.active ? '#4f46e5' : '#e5e7eb'};
  color: ${props => props.active ? 'white' : '#6b7280'};
`;

const StepLabel = styled.span<{ active: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.active ? '#4f46e5' : '#9ca3af'};
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`;

const StepConnector = styled.div`
  width: 1rem;
  height: 1px;
  background: #d1d5db;
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`;

const ReadyBadge = styled.span`
  color: #16a34a;
  font-weight: bold;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Content = styled.div`
  padding: 2rem;

  @media (min-width: 1024px) {
    padding: 3rem;
  }
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const LabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1.125rem;
  font-weight: bold;
  color: #111827;
`;

const HelperText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 10rem;
  padding: 1.5rem;
  background: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 1rem;
  font-size: 1.125rem;
  transition: all 0.2s;

  &:focus {
    border-color: #6366f1;
    background: white;
    outline: none;
  }
`;

const Button = styled.button<{ disabled?: boolean; fullWidth?: boolean }>`
  padding: 1rem 2.5rem;
  background: #4f46e5;
  color: white;
  border-radius: 0.75rem;
  font-weight: bold;
  transition: all 0.2s;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #4338ca;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

const BackButton = styled.button`
  padding: 1rem 2rem;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 0.75rem;
  font-weight: bold;
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background: #e5e7eb;
  }
`;

const VoiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const VoiceButton = styled.button<{ selected: boolean }>`
  padding: 1.5rem;
  border-radius: 1rem;
  border: 2px solid ${props => props.selected ? '#4f46e5' : '#f3f4f6'};
  background: ${props => props.selected ? '#eef2ff' : 'white'};
  text-align: left;
  transition: all 0.2s;
  box-shadow: ${props => props.selected ? '0 0 0 2px #eef2ff' : 'none'};
  cursor: pointer;

  &:hover {
    border-color: ${props => props.selected ? '#4f46e5' : '#c7d2fe'};
  }
`;

const VoiceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const VoiceEmoji = styled.span`
  font-size: 1.875rem;
`;

const VoiceDetails = styled.div``;

const VoiceName = styled.h4`
  font-weight: bold;
  color: #111827;
`;

const VoiceDesc = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
`;

const TimeInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 20rem;
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: #f9fafb;
  border: 2px solid #f3f4f6;
  border-radius: 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4f46e5;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const TimeLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const FlexButton = styled(Button)`
  flex: 1;
`;

const SuccessBox = styled.div`
  padding: 1.5rem;
  background: #f0fdf4;
  border-radius: 1rem;
  border: 1px solid #bbf7d0;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const SuccessIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const SuccessContent = styled.div``;

const SuccessTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  color: #166534;
  margin-bottom: 0.25rem;
`;

const SuccessText = styled.p`
  color: #15803d;
  font-size: 0.875rem;
  line-height: 1.75;
`;

const PreviewCard = styled.div`
  background: #111827;
  color: white;
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid #1f2937;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
`;

const Waveform = styled.div`
  display: flex;
  gap: 0.25rem;
  height: 1.5rem;
  align-items: flex-end;
`;

const WaveBar = styled.div<{ height: number; delay: number }>`
  width: 0.25rem;
  background: #6366f1;
  border-radius: 9999px;
  animation: pulse 1.5s infinite;
  animation-delay: ${props => props.delay}ms;
  height: ${props => props.height * 100}%;
`;

const PreviewLabel = styled.h4`
  color: #818cf8;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

const PreviewTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const PreviewArticles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 15rem;
  overflow-y: auto;
  padding-right: 1rem;

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

const PreviewArticle = styled.div`
  border-left: 2px solid rgba(99, 102, 241, 0.3);
  padding-left: 1rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
`;

const PreviewArticleTitle = styled.h5`
  font-weight: bold;
  color: #e5e7eb;
  margin-bottom: 0.25rem;
`;

const PreviewArticleSummary = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.75;
`;

const NewsCreator: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [schedule, setSchedule] = useState('08:00');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<BriefResponse | null>(null);

  const handleAction = async () => {
    // 이미 로그인되어 있으면 바로 generate 페이지로 이동
    if (isAuthenticated()) {
      navigate('/generate');
      return;
    }

    // 로그인되어 있지 않으면 로그인 진행
    try {
      await signInWithGoogle();
      navigate('/generate');
    } catch (error) {
      console.error('Google 로그인 실패:', error);
    }
  };

  const voices = [
    { id: 'Kore', nameKey: 'newsCreator.voices.professional.name', descKey: 'newsCreator.voices.professional.desc', emoji: '🎙️' },
    { id: 'Puck', nameKey: 'newsCreator.voices.tech.name', descKey: 'newsCreator.voices.tech.desc', emoji: '🚀' },
    { id: 'Charon', nameKey: 'newsCreator.voices.financial.name', descKey: 'newsCreator.voices.financial.desc', emoji: '📈' },
    { id: 'Zephyr', nameKey: 'newsCreator.voices.casual.name', descKey: 'newsCreator.voices.casual.desc', emoji: '☕' },
  ];

  const handleCreatePreview = async () => {
    if (!prompt) return;
    setLoading(true);
    // Mock implementation
    setTimeout(() => {
      setPreview({
        briefDate: new Date().toLocaleDateString(),
        headline: `Your Personalized News: ${prompt}`,
        articles: [
          {
            title: "Sample Article 1",
            summary: "This is a sample article summary based on your prompt.",
            source: "Sample Source",
            category: "TECH"
          }
        ]
      });
      setStep(4);
      setLoading(false);
    }, 2000);
  };

  const waveformHeights = [0.4, 1.2, 0.8, 1.5, 0.6, 1];

  return (
    <Section id="creator">
      <Container>
        <ScrollReveal animation="fadeUp">
          <Header>
            <Title>{t('newsCreator.title')}</Title>
            <Subtitle>{t('newsCreator.subtitle')}</Subtitle>
          </Header>
        </ScrollReveal>

        <ScrollReveal animation="fadeUp" delay={0.2}>
          <Card>
          <StepperHeader>
            <StepperContainer>
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <StepItem>
                    <StepCircle active={step >= s}>{s}</StepCircle>
                    <StepLabel active={step >= s}>
                      {s === 1 ? t('newsCreator.step1') : s === 2 ? t('newsCreator.step2') : t('newsCreator.step3')}
                    </StepLabel>
                  </StepItem>
                  {s < 3 && <StepConnector />}
                </React.Fragment>
              ))}
            </StepperContainer>
            {step === 4 && <ReadyBadge>{t('newsCreator.channelReady')}</ReadyBadge>}
          </StepperHeader>

          <Content>
            {step === 1 && (
              <StepContent>
                <LabelGroup>
                  <Label>{t('newsCreator.step1Title')}</Label>
                  <HelperText>{t('newsCreator.step1Helper')}</HelperText>
                </LabelGroup>
                <Textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('newsCreator.step1Placeholder')}
                />
                <Button 
                  onClick={handleAction}
                >
                  {t('newsCreator.nextChooseVoice')}
                </Button>
              </StepContent>
            )}

            {step === 2 && (
              <StepContent>
                <LabelGroup>
                  <Label>{t('newsCreator.step2Title')}</Label>
                  <HelperText>{t('newsCreator.step2Helper')}</HelperText>
                </LabelGroup>
                <VoiceGrid>
                  {voices.map((v) => (
                    <VoiceButton 
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      selected={voice === v.id}
                    >
                      <VoiceInfo>
                        <VoiceEmoji>{v.emoji}</VoiceEmoji>
                        <VoiceDetails>
                          <VoiceName>{t(v.nameKey)}</VoiceName>
                          <VoiceDesc>{t(v.descKey)}</VoiceDesc>
                        </VoiceDetails>
                      </VoiceInfo>
                    </VoiceButton>
                  ))}
                </VoiceGrid>
                <ButtonGroup>
                  <BackButton onClick={() => setStep(1)}>{t('newsCreator.back')}</BackButton>
                  <Button onClick={handleAction}>{t('newsCreator.nextSetSchedule')}</Button>
                </ButtonGroup>
              </StepContent>
            )}

            {step === 3 && (
              <StepContent>
                <LabelGroup>
                  <Label>{t('newsCreator.step3Title')}</Label>
                  <HelperText>{t('newsCreator.step3Helper')}</HelperText>
                </LabelGroup>
                <TimeInputWrapper>
                  <TimeInput 
                    type="time" 
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                  />
                  <TimeLabel>{t('newsCreator.daily')}</TimeLabel>
                </TimeInputWrapper>
                <ButtonGroup>
                  <BackButton onClick={() => setStep(2)}>{t('newsCreator.back')}</BackButton>
                  <FlexButton 
                    onClick={handleAction}
                  >
                    {t('newsCreator.initializeAgents')}
                  </FlexButton>
                </ButtonGroup>
              </StepContent>
            )}

            {step === 4 && preview && (
              <StepContent>
                <SuccessBox>
                  <SuccessIcon>✨</SuccessIcon>
                  <SuccessContent>
                    <SuccessTitle>{t('newsCreator.channelLive')}</SuccessTitle>
                    <SuccessText>{t('newsCreator.channelLiveDesc')}</SuccessText>
                  </SuccessContent>
                </SuccessBox>

                <PreviewCard>
                  <PreviewHeader>
                    <Waveform>
                      {waveformHeights.map((h, i) => (
                        <WaveBar key={i} height={h} delay={i * 200} />
                      ))}
                    </Waveform>
                  </PreviewHeader>
                  <PreviewLabel>{t('newsCreator.firstEdition', { date: preview.briefDate })}</PreviewLabel>
                  <PreviewTitle>{preview.headline}</PreviewTitle>
                  <PreviewArticles>
                    {preview.articles.map((a, i) => (
                      <PreviewArticle key={i}>
                        <PreviewArticleTitle>{a.title}</PreviewArticleTitle>
                        <PreviewArticleSummary>{a.summary}</PreviewArticleSummary>
                      </PreviewArticle>
                    ))}
                  </PreviewArticles>
                </PreviewCard>

                <ButtonGroup>
                  <FlexButton onClick={handleAction}>{t('newsCreator.confirmSubscription')}</FlexButton>
                  <BackButton onClick={() => setStep(1)}>{t('newsCreator.modifySettings')}</BackButton>
                </ButtonGroup>
              </StepContent>
            )}
          </Content>
        </Card>
        </ScrollReveal>
      </Container>
    </Section>
  );
};

export default NewsCreator;
