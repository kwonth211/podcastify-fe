import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";

const TermsPage = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const lastUpdatedDate =
    i18n.language === "ko" ? "2025년 12월 9일" : "December 9, 2025";

  return (
    <Container>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("terms.seo.title")}</title>
        <meta name="description" content={t("terms.seo.description")} />
        <link rel="canonical" href="https://dailynewspod.com/terms" />
        <meta property="og:title" content={t("terms.seo.title")} />
        <meta property="og:description" content={t("terms.seo.description")} />
        <meta property="og:url" content="https://dailynewspod.com/terms" />
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
          <PageTitle>{t("terms.title")}</PageTitle>
          <LastUpdated>
            {t("common.lastUpdated", { date: lastUpdatedDate })}
          </LastUpdated>
        </PageHeader>

        <ContentSection>
          <Section>
            <SectionTitle>{t("terms.article1.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("terms.article1.content")}</Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("terms.article2.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("terms.article2.content")}</Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("terms.article3.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("terms.article3.intro")}</Paragraph>
              <List>
                <ListItem>{t("terms.article3.item1")}</ListItem>
                <ListItem>{t("terms.article3.item2")}</ListItem>
                <ListItem>{t("terms.article3.item3")}</ListItem>
                <ListItem>{t("terms.article3.item4")}</ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("terms.article4.title")}</SectionTitle>
            <SectionContent>
              <List>
                <ListItem>{t("terms.article4.item1")}</ListItem>
                <ListItem>{t("terms.article4.item2")}</ListItem>
                <ListItem>{t("terms.article4.item3")}</ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("terms.article5.title")}</SectionTitle>
            <SectionContent>
              <List>
                <ListItem>{t("terms.article5.item1")}</ListItem>
                <ListItem>{t("terms.article5.item2")}</ListItem>
                <ListItem>{t("terms.article5.item3")}</ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("terms.article6.title")}</SectionTitle>
            <SectionContent>
              <List>
                <ListItem>
                  <Trans i18nKey="terms.article6.item1">
                    <strong>AI 생성 콘텐츠 한계:</strong> 본 서비스는 AI 기술을
                    활용하여 콘텐츠를 생성합니다.
                  </Trans>
                </ListItem>
                <ListItem>
                  <Trans i18nKey="terms.article6.item2">
                    <strong>정보의 정확성:</strong> 제공되는 뉴스 요약은
                    참고용입니다.
                  </Trans>
                </ListItem>
                <ListItem>
                  <Trans i18nKey="terms.article6.item3">
                    <strong>서비스 중단:</strong> 천재지변, 시스템 장애 등
                    불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지
                    않습니다.
                  </Trans>
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("terms.article7.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("terms.article7.content")}</Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("terms.article8.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("terms.article8.content")}</Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("terms.article9.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>{t("terms.article9.content")}</Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>{t("terms.supplement.title")}</SectionTitle>
            <SectionContent>
              <Paragraph>
                {t("terms.supplement.content", { date: lastUpdatedDate })}
              </Paragraph>
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

export default TermsPage;

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
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
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
