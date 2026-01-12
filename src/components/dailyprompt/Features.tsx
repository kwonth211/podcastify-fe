import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ScrollReveal } from '../common/ScrollReveal';
import { 
  MicrophoneIcon, 
  PenIcon, 
  RunIcon, 
  BrainIcon, 
  RssIcon, 
  EmailIcon 
} from '../common/Icons';

const Section = styled.section`
  padding: 6rem 0;
  background: white;
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const Label = styled.h2`
  color: #4f46e5;
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

const Title = styled.p`
  font-size: 2.25rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  max-width: 42rem;
  margin: 0 auto;
  font-size: 1.25rem;
  color: #4b5563;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid #f3f4f6;
  background: #f9fafb;
  transition: all 0.3s;

  &:hover {
    background: white;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transform: translateY(-0.5rem);
  }
`;

const IconBox = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
  color: #4f46e5;

  ${FeatureCard}:hover & {
    transform: scale(1.1);
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const FeatureDesc = styled.p`
  color: #4b5563;
  line-height: 1.75;
`;

interface Feature {
  titleKey: string;
  descKey: string;
  icon: React.ReactNode;
}

const Features: React.FC = () => {
  const { t } = useTranslation();

  const features: Feature[] = [
    {
      titleKey: "features.naturalAiVoices.title",
      descKey: "features.naturalAiVoices.desc",
      icon: <MicrophoneIcon size={28} />
    },
    {
      titleKey: "features.promptToScript.title",
      descKey: "features.promptToScript.desc",
      icon: <PenIcon size={28} />
    },
    {
      titleKey: "features.multitaskingHero.title",
      descKey: "features.multitaskingHero.desc",
      icon: <RunIcon size={28} />
    },
    {
      titleKey: "features.smartSummaries.title",
      descKey: "features.smartSummaries.desc",
      icon: <BrainIcon size={28} />
    },
    {
      titleKey: "features.privateRssFeed.title",
      descKey: "features.privateRssFeed.desc",
      icon: <RssIcon size={28} />
    },
    {
      titleKey: "features.emailDelivery.title",
      descKey: "features.emailDelivery.desc",
      icon: <EmailIcon size={28} />
    }
  ];

  return (
    <Section id="features">
      <Container>
        <ScrollReveal animation="fadeUp">
          <Header>
            <Label>{t('features.label')}</Label>
            <Title>{t('features.title')}</Title>
            <Subtitle>{t('features.subtitle')}</Subtitle>
          </Header>
        </ScrollReveal>
        <Grid>
          {features.map((f, i) => (
            <ScrollReveal key={i} animation="fadeUp" delay={i * 0.1}>
              <FeatureCard>
                <IconBox>{f.icon}</IconBox>
                <FeatureTitle>{t(f.titleKey)}</FeatureTitle>
                <FeatureDesc>{t(f.descKey)}</FeatureDesc>
              </FeatureCard>
            </ScrollReveal>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Features;
