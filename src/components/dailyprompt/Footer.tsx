import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GlobeIcon, EmailIcon } from '../common/Icons';

const FooterSection = styled.footer`
  background: #f8fafc;
  padding: 3rem 0 2rem;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoImage = styled.img`
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }
`;

const Links = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterLink = styled(Link)`
  font-size: 0.875rem;
  color: #64748b;
  text-decoration: none;
  padding: 0.25rem 0.75rem;
  transition: color 0.2s;

  &:hover {
    color: #6366f1;
  }
`;

const Divider = styled.span`
  color: #cbd5e1;
  font-size: 0.875rem;
`;

const ContactEmail = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #6366f1;
  }
`;

const Copyright = styled.p`
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0;
`;

const Disclaimer = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
  margin: 0;
`;

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  return (
    <FooterSection>
      <Container>
        <LogoContainer>
          <LogoImage src="/logo.png" alt="DailyNewsPodcast" />
          <LogoText>Daily News Podcast</LogoText>
        </LogoContainer>

        <LanguageButton onClick={toggleLanguage}>
          <GlobeIcon size={16} color="#6b7280" />
          {i18n.language === 'ko' ? 'English' : '한국어'}
        </LanguageButton>

        <Links>
          <FooterLink to="/about">{t('common.about')}</FooterLink>
          <Divider>|</Divider>
          <FooterLink to="/contact">{t('common.contact')}</FooterLink>
          <Divider>|</Divider>
          <FooterLink to="/privacy">{t('footer.privacy')}</FooterLink>
          <Divider>|</Divider>
          <FooterLink to="/terms">{t('footer.terms')}</FooterLink>
        </Links>

        <ContactEmail href="mailto:contact@dailynewspod.com">
          <EmailIcon size={16} color="#6b7280" />
          contact@dailynewspod.com
        </ContactEmail>

        <Copyright>
          © {currentYear} Daily News Podcast. All rights reserved.
        </Copyright>

        <Disclaimer>
          {t('footer.disclaimer')}
        </Disclaimer>
      </Container>
    </FooterSection>
  );
};

export default Footer;
