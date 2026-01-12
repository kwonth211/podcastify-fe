/**
 * 결제 페이지 - 플랜 선택 및 결제
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../dailyprompt/Navbar';
import Footer from '../dailyprompt/Footer';
import { PricingPlans } from '../common/PricingPlans';
import { PlanType } from '../../types/subscription';
import { getPaymentProvider, initiatePayment } from '../../services/paymentService';
import { isAuthenticated, getCurrentUser, signInWithGoogle } from '../../utils/googleAuth';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
`;

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 7rem 1.5rem 4rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const CompareSection = styled.section`
  margin-top: 5rem;
  padding-top: 3rem;
  border-top: 1px solid #e5e7eb;
`;

const CompareTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
`;

const CompareTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  background: #f9fafb;
`;

const Td = styled.td<{ $highlight?: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  background: ${props => props.$highlight ? '#f0fdf4' : 'white'};
`;

const FAQSection = styled.section`
  margin-top: 4rem;
`;

const FAQTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FAQItem = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
`;

const FAQQuestion = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const FAQAnswer = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
`;

const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);

  const handleSelectPlan = async (planId: PlanType) => {
    // Free 플랜은 바로 시작
    if (planId === 'free') {
      if (!isAuthenticated()) {
        try {
          await signInWithGoogle();
        } catch (error) {
          console.error('Login failed:', error);
          return;
        }
      }
      navigate('/generate');
      return;
    }

    // 유료 플랜 - 로그인 확인
    if (!isAuthenticated()) {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Login failed:', error);
        return;
      }
    }

    const user = getCurrentUser();
    if (!user) return;

    setLoadingPlan(planId);

    try {
      const result = await initiatePayment(
        planId,
        user.sub,
        user.email,
        user.name
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      // 토스 결제인 경우 결제 페이지로 이동 필요
      const provider = getPaymentProvider();
      if (provider === 'toss' && result.paymentId) {
        navigate(`/payment/checkout?orderId=${result.paymentId}`);
      }
      // Stripe는 자동으로 리다이렉트됨
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert(error instanceof Error ? error.message : t('pricing.paymentError'));
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>{t('pricing.pageTitle')} - DailyNewsPodcast</title>
      </Helmet>
      <Navbar />

      <Main>
        <Header>
          <Title>{t('pricing.title')}</Title>
          <Subtitle>{t('pricing.subtitle')}</Subtitle>
        </Header>

        <PricingPlans 
          showCurrencyToggle={true}
          onPlanSelect={handleSelectPlan}
          loadingPlan={loadingPlan}
          variant="page"
        />

        <CompareSection>
          <CompareTitle>{t('pricing.compareTitle')}</CompareTitle>
          <CompareTable>
            <Table>
              <thead>
                <tr>
                  <Th>{t('pricing.feature')}</Th>
                  <Th>Free</Th>
                  <Th>Basic</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>{t('pricing.compare.batchTokens')}</Td>
                  <Td>{t('pricing.features.batchTokensValid', { count: 7, days: 7 })}</Td>
                  <Td $highlight>{t('pricing.features.batchTokensValid', { count: 30, days: 30 })}</Td>
                </tr>
                <tr>
                  <Td>{t('pricing.compare.scheduler')}</Td>
                  <Td>{t('pricing.available')}</Td>
                  <Td $highlight>{t('pricing.available')}</Td>
                </tr>
                <tr>
                  <Td>{t('pricing.compare.voices')}</Td>
                  <Td>{t('pricing.standard')}</Td>
                  <Td $highlight>{t('pricing.standard')}</Td>
                </tr>
                <tr>
                  <Td>{t('pricing.compare.rss')}</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                </tr>
                <tr>
                  <Td>{t('pricing.compare.priority')}</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                </tr>
              </tbody>
            </Table>
          </CompareTable>
        </CompareSection>

        <FAQSection>
          <FAQTitle>{t('pricing.faqTitle')}</FAQTitle>
          <FAQGrid>
            <FAQItem>
              <FAQQuestion>{t('pricing.faq.q1')}</FAQQuestion>
              <FAQAnswer>{t('pricing.faq.a1')}</FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>{t('pricing.faq.q2')}</FAQQuestion>
              <FAQAnswer>{t('pricing.faq.a2')}</FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>{t('pricing.faq.q3')}</FAQQuestion>
              <FAQAnswer>{t('pricing.faq.a3')}</FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>{t('pricing.faq.q4')}</FAQQuestion>
              <FAQAnswer>{t('pricing.faq.a4')}</FAQAnswer>
            </FAQItem>
          </FAQGrid>
        </FAQSection>
      </Main>

      <Footer />
    </Container>
  );
};

export default PricingPage;
