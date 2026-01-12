import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const CTAButton = styled.button`
  display: block;
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  z-index: 50;
  width: calc(100% - 3rem);
  background: #4f46e5;
  color: white;
  padding: 1rem;
  border-radius: 1rem;
  font-weight: bold;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
  border: none;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileCTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <CTAButton>
      {t('mobileCTA.button')}
    </CTAButton>
  );
};

export default MobileCTA;
