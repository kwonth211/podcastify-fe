/**
 * 공통 플랜 카드 컴포넌트
 * 메인 페이지와 가격 페이지에서 재사용
 */

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlanType, PLANS, PLANS_KRW } from '../../types/subscription';
import { CheckIcon, CrownIcon, StarIcon, LightningIcon } from './Icons';
import { isAuthenticated, getCurrentUser, signInWithGoogle } from '../../utils/googleAuth';
import { getPaymentProvider, initiatePayment } from '../../services/paymentService';

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PlanCard = styled.div<{ $featured?: boolean }>`
  position: relative;
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  border: 2px solid ${props => props.$featured ? '#4f46e5' : '#e5e7eb'};
  box-shadow: ${props => props.$featured 
    ? '0 25px 50px -12px rgba(79, 70, 229, 0.25)' 
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s;
  display: flex;
  flex-direction: column;

  ${props => props.$featured && `
    transform: scale(1.05);
    z-index: 1;
  `}

  &:hover {
    transform: ${props => props.$featured ? 'scale(1.07)' : 'translateY(-4px)'};
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const PlanIcon = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const PlanName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 0.5rem;
`;

const Price = styled.span`
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
`;

const Currency = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  margin-right: 0.25rem;
`;

const Period = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.25rem;
`;

const PlanDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  min-height: 2.5rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
`;

const FeatureItem = styled.li<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: ${props => props.$disabled ? '#9ca3af' : '#374151'};
  text-decoration: ${props => props.$disabled ? 'line-through' : 'none'};
`;

const FeatureIcon = styled.span<{ $active?: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: ${props => props.$active ? '#dcfce7' : '#f3f4f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PlanButton = styled.button<{ $featured?: boolean }>`
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$featured 
    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' 
    : '#f3f4f6'};
  color: ${props => props.$featured ? 'white' : '#374151'};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.$featured 
      ? '0 10px 25px -5px rgba(79, 70, 229, 0.4)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface PricingPlansProps {
  showCurrencyToggle?: boolean;
  onPlanSelect?: (planId: PlanType) => void;
  loadingPlan?: PlanType | null;
  variant?: 'landing' | 'page'; // 'landing' = 메인 페이지, 'page' = 가격 페이지
}

export const PricingPlans: React.FC<PricingPlansProps> = ({
  showCurrencyToggle = false,
  onPlanSelect,
  loadingPlan = null,
  variant = 'landing',
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isKRW, setIsKRW] = React.useState(i18n.language === 'ko');

  React.useEffect(() => {
    setIsKRW(i18n.language === 'ko');
  }, [i18n.language]);

  const handleSelectPlan = async (planId: PlanType) => {
    if (onPlanSelect) {
      onPlanSelect(planId);
      return;
    }

    // 기본 동작: Free 플랜은 바로 시작
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

      const provider = getPaymentProvider();
      if (provider === 'toss' && result.paymentId) {
        navigate(`/payment/checkout?orderId=${result.paymentId}`);
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert(error instanceof Error ? error.message : t('pricing.paymentError'));
    }
  };

  const plans = [
    {
      id: 'free' as PlanType,
      icon: <LightningIcon size={24} color="#4f46e5" />,
      iconBg: '#eef2ff',
      featured: false,
    },
    {
      id: 'basic' as PlanType,
      icon: <StarIcon size={24} color="#f59e0b" />,
      iconBg: '#fef3c7',
      featured: true,
    },
  ];

  return (
    <>
      {showCurrencyToggle && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
          <button
            onClick={() => setIsKRW(false)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: `2px solid ${!isKRW ? '#4f46e5' : '#e5e7eb'}`,
              background: !isKRW ? '#eef2ff' : 'white',
              color: !isKRW ? '#4f46e5' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            USD ($)
          </button>
          <button
            onClick={() => setIsKRW(true)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: `2px solid ${isKRW ? '#4f46e5' : '#e5e7eb'}`,
              background: isKRW ? '#eef2ff' : 'white',
              color: isKRW ? '#4f46e5' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            KRW (₩)
          </button>
        </div>
      )}

      <PlansGrid>
        {plans.map(plan => {
          const planData = PLANS[plan.id];
          const features = planData.features;

          return (
            <PlanCard key={plan.id} $featured={plan.featured}>
              {plan.featured && (
                <Badge>
                  <StarIcon size={12} color="white" />
                  {t('pricing.recommended')}
                </Badge>
              )}

              <PlanIcon $color={plan.iconBg}>
                {plan.icon}
              </PlanIcon>

              <PlanName>{t(`pricing.plans.${plan.id}.name`)}</PlanName>

              <PriceContainer>
                {plan.id !== 'free' && <Currency>{isKRW ? '₩' : '$'}</Currency>}
                <Price>
                  {plan.id === 'free' 
                    ? t('pricing.plans.free.price')
                    : isKRW 
                      ? PLANS_KRW[plan.id].toLocaleString()
                      : planData.price}
                </Price>
                {plan.id !== 'free' && (
                  <Period>/{t('pricing.perMonth')}</Period>
                )}
              </PriceContainer>

              <PlanDescription>
                {t(`pricing.plans.${plan.id}.desc`)}
              </PlanDescription>

              <FeatureList>
                <FeatureItem>
                  <FeatureIcon $active={true}>
                    <CheckIcon size={12} color="#22c55e" />
                  </FeatureIcon>
                  {features.batchTokens === -1
                    ? t('pricing.features.unlimitedBatchTokens')
                    : t('pricing.features.batchTokensValid', { 
                        count: features.batchTokens, 
                        days: features.batchTokenValidityDays 
                      })}
                </FeatureItem>

                <FeatureItem $disabled={!features.schedulerEnabled}>
                  <FeatureIcon $active={features.schedulerEnabled}>
                    {features.schedulerEnabled && <CheckIcon size={12} color="#22c55e" />}
                  </FeatureIcon>
                  {features.schedulerEnabled 
                    ? t('pricing.features.scheduler', { count: features.maxSchedules === -1 ? '∞' : features.batchTokens })
                    : t('pricing.features.noScheduler')}
                </FeatureItem>

                <FeatureItem $disabled={!features.premiumVoices}>
                  <FeatureIcon $active={features.premiumVoices}>
                    {features.premiumVoices && <CheckIcon size={12} color="#22c55e" />}
                  </FeatureIcon>
                  {features.premiumVoices 
                    ? t('pricing.features.premiumVoices')
                    : t('pricing.features.standardVoices')}
                </FeatureItem>

                <FeatureItem $disabled={!features.rssFeed}>
                  <FeatureIcon $active={features.rssFeed}>
                    {features.rssFeed && <CheckIcon size={12} color="#22c55e" />}
                  </FeatureIcon>
                  {features.rssFeed 
                    ? t('pricing.features.rssFeed')
                    : t('pricing.features.noRssFeed')}
                </FeatureItem>
              </FeatureList>

              <PlanButton 
                $featured={plan.featured}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === plan.id 
                  ? t('pricing.processing')
                  : t(`pricing.plans.${plan.id}.button`)}
              </PlanButton>
            </PlanCard>
          );
        })}
      </PlansGrid>
    </>
  );
};
