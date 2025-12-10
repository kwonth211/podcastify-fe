import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";

const PrivacyPage = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const lastUpdatedDate =
    i18n.language === "ko" ? "2025년 12월 9일" : "December 9, 2025";

  return (
    <Container>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("privacy.seo.title")}</title>
        <meta name="description" content={t("privacy.seo.description")} />
        <link rel="canonical" href="https://dailynewspod.com/privacy" />
        <meta property="og:title" content={t("privacy.seo.title")} />
        <meta
          property="og:description"
          content={t("privacy.seo.description")}
        />
        <meta property="og:url" content="https://dailynewspod.com/privacy" />
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
            <NavLink to="/contact">{t("nav.contact")}</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <PageHeader>
          <PageTitle>{t("privacy.title")}</PageTitle>
          <LastUpdated>
            {t("common.lastUpdated", { date: lastUpdatedDate })}
          </LastUpdated>
        </PageHeader>

        <ContentSection>
          <Section>
            <SectionTitle>{t("privacy.section1.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("privacy.section1.intro")}</Paragraph>
              <List>
                <ListItem>
                  <Trans i18nKey="privacy.section1.item1">
                    <strong>자동 수집 정보:</strong> 접속 IP 주소, 브라우저
                    유형, 접속 일시, 서비스 이용 기록
                  </Trans>
                </ListItem>
                <ListItem>
                  <Trans i18nKey="privacy.section1.item2">
                    <strong>쿠키 정보:</strong> 사용자 환경 설정, 세션 정보
                  </Trans>
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("privacy.section2.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("privacy.section2.intro")}</Paragraph>
              <List>
                <ListItem>{t("privacy.section2.item1")}</ListItem>
                <ListItem>{t("privacy.section2.item2")}</ListItem>
                <ListItem>{t("privacy.section2.item3")}</ListItem>
                <ListItem>{t("privacy.section2.item4")}</ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("privacy.section3.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("privacy.section3.p1")}</Paragraph>
              <Paragraph>
                <Trans i18nKey="privacy.section3.p2">
                  <strong>쿠키 사용 목적:</strong>
                </Trans>
              </Paragraph>
              <List>
                <ListItem>{t("privacy.section3.item1")}</ListItem>
                <ListItem>{t("privacy.section3.item2")}</ListItem>
                <ListItem>{t("privacy.section3.item3")}</ListItem>
              </List>
              <Paragraph>{t("privacy.section3.p3")}</Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("privacy.section4.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("privacy.section4.p1")}</Paragraph>
              <Paragraph>
                <Trans i18nKey="privacy.section4.p2">
                  Google의 광고 쿠키 사용에 대한 자세한 내용은{" "}
                  <ExternalLink
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google 광고 정책
                  </ExternalLink>
                  에서 확인하실 수 있습니다.
                </Trans>
              </Paragraph>
              <Paragraph>
                <Trans i18nKey="privacy.section4.p3">
                  사용자는{" "}
                  <ExternalLink
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google 광고 설정
                  </ExternalLink>
                  에서 맞춤 광고를 거부할 수 있습니다.
                </Trans>
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("privacy.section5.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("privacy.section5.p1")}</Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("privacy.section6.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("privacy.section6.p1")}</Paragraph>
              <ContactBox>
                <ContactIcon>✉️</ContactIcon>
                <ContactEmail href="mailto:contact@dailynewspod.com">
                  contact@dailynewspod.com
                </ContactEmail>
              </ContactBox>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("privacy.section7.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("privacy.section7.p1")}</Paragraph>
            </SectionContent>
          </Section>
        </ContentSection>

        <BackToHome>
          <BackLink to="/">{t("common.backToHome")}</BackLink>
        </BackToHome>
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

export default PrivacyPage;

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
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.75rem 0;
  font-size: 2rem;
  font-weight: 800;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const LastUpdated = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Section = styled.section``;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const SectionContent = styled.div``;

const Paragraph = styled.p`
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.8;
  margin: 0 0 1rem 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const List = styled.ul`
  margin: 0.75rem 0;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExternalLink = styled.a`
  color: #667eea;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ContactBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
`;

const ContactIcon = styled.span`
  font-size: 1rem;
`;

const ContactEmail = styled.a`
  color: #667eea;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const BackToHome = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #667eea;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #764ba2;
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
