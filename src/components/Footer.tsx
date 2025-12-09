import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

function Footer() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ko" ? "en" : "ko";
    i18n.changeLanguage(newLang);
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterLogo>
          <LogoIcon>🎙️</LogoIcon>
          <LogoText>Daily News Podcast</LogoText>
        </FooterLogo>

        <LanguageSwitch onClick={toggleLanguage}>
          <LanguageIcon>🌐</LanguageIcon>
          <LanguageText>
            {i18n.language === "ko" ? "English" : "한국어"}
          </LanguageText>
        </LanguageSwitch>

        <FooterLinks>
          <FooterLink to="/about">{t("footer.about")}</FooterLink>
          <FooterDivider>|</FooterDivider>
          <FooterLink to="/contact">{t("footer.contact")}</FooterLink>
          <FooterDivider>|</FooterDivider>
          <FooterLink to="/privacy">{t("footer.privacy")}</FooterLink>
          <FooterDivider>|</FooterDivider>
          <FooterLink to="/terms">{t("footer.terms")}</FooterLink>
        </FooterLinks>

        <FooterInfo>
          <FooterContact>
            <ContactItem>
              <ContactIcon>✉️</ContactIcon>
              <ContactText>contact@dailynewspod.com</ContactText>
            </ContactItem>
          </FooterContact>
        </FooterInfo>

        <FooterCopyright>
          {t("footer.copyright", { year: currentYear })}
        </FooterCopyright>

        <FooterDisclaimer>{t("footer.disclaimer")}</FooterDisclaimer>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  padding: 3rem 2rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin-top: 3rem;
  }
`;

const FooterContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.span`
  font-size: 1.75rem;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #334155;
`;

const LanguageSwitch = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LanguageIcon = styled.span`
  font-size: 1rem;
`;

const LanguageText = styled.span`
  font-size: 0.875rem;
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const FooterLink = styled(Link)`
  color: #64748b;
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #667eea;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const FooterDivider = styled.span`
  color: #cbd5e1;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FooterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterContact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
`;

const ContactIcon = styled.span`
  font-size: 0.875rem;
`;

const ContactText = styled.span`
  font-size: 0.875rem;
  color: #64748b;
`;

const FooterCopyright = styled.p`
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0;
`;

const FooterDisclaimer = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.6;
  max-width: 500px;
`;
