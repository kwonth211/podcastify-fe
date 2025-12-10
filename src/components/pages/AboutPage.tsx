import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Container>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("about.seo.title")}</title>
        <meta name="description" content={t("about.seo.description")} />
        <link rel="canonical" href="https://dailynewspod.com/about" />
        <meta property="og:title" content={t("about.seo.title")} />
        <meta property="og:description" content={t("about.seo.description")} />
        <meta property="og:url" content="https://dailynewspod.com/about" />
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
            <NavLink to="/about" $active>
              {t("nav.about")}
            </NavLink>
            <NavLink to="/contact">{t("nav.contact")}</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <HeroSection>
          <HeroIcon>🎙️</HeroIcon>
          <HeroTitle>Daily News Podcast</HeroTitle>
          <HeroSubtitle>{t("about.heroSubtitle")}</HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <Section>
            <SectionTitle>{t("about.intro.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("about.intro.p1")}</Paragraph>
              <Paragraph>{t("about.intro.p2")}</Paragraph>
              <Paragraph>
                <Trans i18nKey="about.intro.p3">
                  모든 콘텐츠는 <strong>완전 무료</strong>로 제공되며, 별도의
                  가입 없이 바로 청취하실 수 있습니다.
                </Trans>
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("about.features.title")}</SectionTitle>
            <FeatureGrid>
              <FeatureCard>
                <FeatureIcon>🤖</FeatureIcon>
                <FeatureTitle>{t("about.features.ai.title")}</FeatureTitle>
                <FeatureDescription>
                  {t("about.features.ai.desc")}
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🎧</FeatureIcon>
                <FeatureTitle>{t("about.features.voice.title")}</FeatureTitle>
                <FeatureDescription>
                  {t("about.features.voice.desc")}
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📅</FeatureIcon>
                <FeatureTitle>{t("about.features.daily.title")}</FeatureTitle>
                <FeatureDescription>
                  {t("about.features.daily.desc")}
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📱</FeatureIcon>
                <FeatureTitle>
                  {t("about.features.anywhere.title")}
                </FeatureTitle>
                <FeatureDescription>
                  {t("about.features.anywhere.desc")}
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📄</FeatureIcon>
                <FeatureTitle>
                  {t("about.features.transcript.title")}
                </FeatureTitle>
                <FeatureDescription>
                  {t("about.features.transcript.desc")}
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>⏱️</FeatureIcon>
                <FeatureTitle>
                  {t("about.features.timeline.title")}
                </FeatureTitle>
                <FeatureDescription>
                  {t("about.features.timeline.desc")}
                </FeatureDescription>
              </FeatureCard>
            </FeatureGrid>
          </Section>

          <Section>
            <SectionTitle>{t("about.recommend.title")}</SectionTitle>
            <RecommendList>
              <RecommendItem>
                <RecommendIcon>🚗</RecommendIcon>
                <RecommendText>{t("about.recommend.commute")}</RecommendText>
              </RecommendItem>
              <RecommendItem>
                <RecommendIcon>🏃</RecommendIcon>
                <RecommendText>{t("about.recommend.exercise")}</RecommendText>
              </RecommendItem>
              <RecommendItem>
                <RecommendIcon>👀</RecommendIcon>
                <RecommendText>{t("about.recommend.eyes")}</RecommendText>
              </RecommendItem>
              <RecommendItem>
                <RecommendIcon>⏰</RecommendIcon>
                <RecommendText>{t("about.recommend.busy")}</RecommendText>
              </RecommendItem>
            </RecommendList>
          </Section>

          <Section>
            <SectionTitle>{t("about.notice.title")}</SectionTitle>
            <NoticeBox>
              <NoticeItem>
                <NoticeIcon>ℹ️</NoticeIcon>
                <NoticeText>{t("about.notice.ai")}</NoticeText>
              </NoticeItem>
              <NoticeItem>
                <NoticeIcon>📋</NoticeIcon>
                <NoticeText>{t("about.notice.reference")}</NoticeText>
              </NoticeItem>
              <NoticeItem>
                <NoticeIcon>🗣️</NoticeIcon>
                <NoticeText>{t("about.notice.voice")}</NoticeText>
              </NoticeItem>
            </NoticeBox>
          </Section>

          <Section>
            <SectionTitle>{t("about.contactSection.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("about.contactSection.desc")}</Paragraph>
            </SectionContent>
            <ContactBox>
              <ContactIcon>✉️</ContactIcon>
              <ContactEmail href="mailto:contact@dailynewspod.com">
                contact@dailynewspod.com
              </ContactEmail>
            </ContactBox>
          </Section>
        </ContentSection>

        <CTASection>
          <CTATitle>{t("about.cta.title")}</CTATitle>
          <CTADescription>{t("about.cta.desc")}</CTADescription>
          <CTAButton to="/">{t("about.cta.button")}</CTAButton>
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

export default AboutPage;

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
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 20px;
  margin-bottom: 3rem;
`;

const HeroIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  margin: 0 0 0.75rem 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0;
  font-size: 1.25rem;
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
  margin: 0 0 1rem 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  margin: 0 0 0.75rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
`;

const FeatureDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
`;

const RecommendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecommendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const RecommendIcon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const RecommendText = styled.span`
  font-size: 1rem;
  color: #374151;
`;

const NoticeBox = styled.div`
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  font-size: 0.9375rem;
  color: #92400e;
  line-height: 1.6;
`;

const ContactBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem 1.5rem;
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

const CTASection = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin-top: 3rem;
`;

const CTATitle = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
`;

const CTADescription = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: white;
  color: #667eea;
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Footer = styled.footer`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #e2e8f0;
  padding: 3rem 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 900px;
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
