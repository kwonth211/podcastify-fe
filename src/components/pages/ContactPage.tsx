import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Container>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("contact.seo.title")}</title>
        <meta name="description" content={t("contact.seo.description")} />
        <link rel="canonical" href="https://dailynewspod.com/contact" />
        <meta property="og:title" content={t("contact.seo.title")} />
        <meta
          property="og:description"
          content={t("contact.seo.description")}
        />
        <meta property="og:url" content="https://dailynewspod.com/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header>
        <HeaderContent>
          <Logo to="/">
            <LogoIcon>🎙️</LogoIcon>
            <LogoText>Daily News Podcast</LogoText>
          </Logo>
          <Nav>
            <NavLink to="/">{t("nav.home")}</NavLink>
            <NavLink to="/about">{t("nav.about")}</NavLink>
            <NavLink to="/contact" $active>
              {t("nav.contact")}
            </NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <PageHeader>
          <PageIcon>📬</PageIcon>
          <PageTitle>{t("contact.title")}</PageTitle>
          <PageSubtitle>{t("contact.subtitle")}</PageSubtitle>
        </PageHeader>

        <ContentSection>
          <ContactCard>
            <ContactCardHeader>
              <ContactCardIcon>✉️</ContactCardIcon>
              <ContactCardTitle>{t("contact.email.title")}</ContactCardTitle>
            </ContactCardHeader>
            <ContactCardContent>
              <ContactEmail href="mailto:contact@dailynewspod.com">
                contact@dailynewspod.com
              </ContactEmail>
              <ContactDescription>
                <Trans i18nKey="contact.email.desc">
                  일반적인 문의사항, 서비스 피드백, 협업 제안 등 모든 문의를
                  환영합니다.
                  <br />
                  보내주신 이메일은 영업일 기준 1-2일 내에 답변드리겠습니다.
                </Trans>
              </ContactDescription>
            </ContactCardContent>
          </ContactCard>

          <Section>
            <SectionTitle>{t("contact.faq.title")}</SectionTitle>
            <FAQList>
              <FAQItem>
                <FAQQuestion>{t("contact.faq.q1")}</FAQQuestion>
                <FAQAnswer>{t("contact.faq.a1")}</FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>{t("contact.faq.q2")}</FAQQuestion>
                <FAQAnswer>{t("contact.faq.a2")}</FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>{t("contact.faq.q3")}</FAQQuestion>
                <FAQAnswer>{t("contact.faq.a3")}</FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>{t("contact.faq.q4")}</FAQQuestion>
                <FAQAnswer>{t("contact.faq.a4")}</FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>{t("contact.faq.q5")}</FAQQuestion>
                <FAQAnswer>{t("contact.faq.a5")}</FAQAnswer>
              </FAQItem>
            </FAQList>
          </Section>

          <Section>
            <SectionTitle>{t("contact.tips.title")}</SectionTitle>
            <InfoBox>
              <InfoItem>
                <InfoIcon>💡</InfoIcon>
                <InfoText>{t("contact.tips.tip1")}</InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon>🔒</InfoIcon>
                <InfoText>{t("contact.tips.tip2")}</InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon>⏰</InfoIcon>
                <InfoText>{t("contact.tips.tip3")}</InfoText>
              </InfoItem>
            </InfoBox>
          </Section>

          <Section>
            <SectionTitle>{t("contact.partnership.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("contact.partnership.desc")}</Paragraph>
            </SectionContent>
            <PartnershipBox>
              <PartnershipIcon>🤝</PartnershipIcon>
              <PartnershipEmail href="mailto:contact@dailynewspod.com">
                contact@dailynewspod.com
              </PartnershipEmail>
            </PartnershipBox>
          </Section>
        </ContentSection>

        <CTASection>
          <CTATitle>{t("contact.cta.title")}</CTATitle>
          <CTADescription>{t("contact.cta.desc")}</CTADescription>
          <CTAButton to="/">{t("contact.cta.button")}</CTAButton>
        </CTASection>
      </Main>

      <Footer>
        <FooterContent>
          <FooterLogo>
            <LogoIcon>🎙️</LogoIcon>
            <FooterLogoText>Daily News Podcast</FooterLogoText>
          </FooterLogo>
          <FooterLinks>
            <FooterLink to="/about">{t("footer.about")}</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/contact">{t("footer.contact")}</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/privacy">{t("footer.privacy")}</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/terms">{t("footer.terms")}</FooterLink>
          </FooterLinks>
          <FooterCopyright>
            {t("footer.copyright", { year: currentYear })}
          </FooterCopyright>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default ContactPage;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`;

const LogoIcon = styled.span`
  font-size: 1.5rem;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${(props) => (props.$active ? "#667eea" : "#4b5563")};
  text-decoration: none;
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  font-size: 0.9375rem;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #667eea;
  }
`;

const Main = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.75rem 0;
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 1.125rem;
  color: #6b7280;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const ContactCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
`;

const ContactCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ContactCardIcon = styled.span`
  font-size: 2rem;
`;

const ContactCardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const ContactCardContent = styled.div``;

const ContactEmail = styled.a`
  display: inline-block;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  margin-bottom: 1rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const ContactDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  opacity: 0.95;
`;

const Section = styled.section``;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const SectionContent = styled.div``;

const Paragraph = styled.p`
  font-size: 1rem;
  color: #374151;
  line-height: 1.8;
  margin: 0;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
`;

const FAQQuestion = styled.h3`
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
`;

const FAQAnswer = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.7;
`;

const InfoBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

const InfoIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: #166534;
  line-height: 1.6;
`;

const PartnershipBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const PartnershipIcon = styled.span`
  font-size: 1.25rem;
`;

const PartnershipEmail = styled.a`
  color: #667eea;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 20px;
  margin-top: 3rem;
`;

const CTATitle = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const CTADescription = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  color: #6b7280;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const Footer = styled.footer`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #e2e8f0;
  padding: 3rem 2rem;
  margin-top: 4rem;
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
  gap: 0.5rem;
`;

const FooterLogoText = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #334155;
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
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #667eea;
  }
`;

const FooterDivider = styled.span`
  color: #cbd5e1;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FooterCopyright = styled.p`
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0;
`;
