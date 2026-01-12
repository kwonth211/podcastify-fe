import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ScrollReveal } from '../common/ScrollReveal';
import { PricingPlans } from '../common/PricingPlans';

const Section = styled.section`
  padding: 6rem 0;
  background: #f9fafb;
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
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-size: 2.25rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #4b5563;
`;

const Pricing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section id="pricing">
      <Container>
        <ScrollReveal animation="fadeUp">
          <Header>
            <Title>{t('pricing.title')}</Title>
            <Subtitle>{t('pricing.subtitle')}</Subtitle>
          </Header>
        </ScrollReveal>
        <ScrollReveal animation="fadeUp" delay={0.2}>
          <PricingPlans variant="landing" />
        </ScrollReveal>
      </Container>
    </Section>
  );
};

export default Pricing;
