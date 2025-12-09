import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

function PrivacyPage() {
  return (
    <Container>
      <Helmet>
        <title>개인정보처리방침 - Daily News Podcast</title>
        <meta
          name="description"
          content="Daily News Podcast의 개인정보처리방침입니다. 개인정보 수집 및 이용, 쿠키 사용, 제3자 광고 서비스에 대한 안내입니다."
        />
        <meta
          name="keywords"
          content="Daily News Podcast, 개인정보처리방침, 개인정보보호, 쿠키 정책, 광고 정책"
        />
        <link rel="canonical" href="https://dailynewspod.com/privacy" />
        <meta
          property="og:title"
          content="개인정보처리방침 - Daily News Podcast"
        />
        <meta
          property="og:description"
          content="Daily News Podcast의 개인정보처리방침입니다."
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
            <NavLink to="/">홈</NavLink>
            <NavLink to="/about">소개</NavLink>
            <NavLink to="/contact">문의</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <PageHeader>
          <PageTitle>개인정보처리방침</PageTitle>
          <LastUpdated>최종 수정일: 2025년 12월 9일</LastUpdated>
        </PageHeader>

        <ContentSection>
          <Section>
            <SectionTitle>1. 개인정보 수집 항목</SectionTitle>
            <SectionContent>
              <Paragraph>
                Daily News Podcast(이하 "서비스")는 서비스 제공을 위해 다음과
                같은 정보를 수집할 수 있습니다:
              </Paragraph>
              <List>
                <ListItem>
                  <strong>자동 수집 정보:</strong> 접속 IP 주소, 브라우저 유형,
                  접속 일시, 서비스 이용 기록
                </ListItem>
                <ListItem>
                  <strong>쿠키 정보:</strong> 사용자 환경 설정, 세션 정보
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>2. 개인정보 수집 및 이용 목적</SectionTitle>
            <SectionContent>
              <Paragraph>수집된 정보는 다음 목적으로 이용됩니다:</Paragraph>
              <List>
                <ListItem>서비스 제공 및 운영</ListItem>
                <ListItem>서비스 개선 및 사용자 경험 최적화</ListItem>
                <ListItem>통계 분석 및 서비스 품질 향상</ListItem>
                <ListItem>광고 게재 및 맞춤형 광고 제공</ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>3. 쿠키(Cookie) 사용</SectionTitle>
            <SectionContent>
              <Paragraph>
                본 서비스는 사용자 경험 개선을 위해 쿠키를 사용합니다. 쿠키는
                웹사이트가 사용자의 컴퓨터에 저장하는 작은 텍스트 파일입니다.
              </Paragraph>
              <Paragraph>
                <strong>쿠키 사용 목적:</strong>
              </Paragraph>
              <List>
                <ListItem>사용자 환경 설정 저장</ListItem>
                <ListItem>서비스 이용 통계 수집</ListItem>
                <ListItem>광고 효과 측정</ListItem>
              </List>
              <Paragraph>
                사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이
                경우 서비스 이용에 일부 제한이 있을 수 있습니다.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>4. 제3자 광고 서비스</SectionTitle>
            <SectionContent>
              <Paragraph>
                본 서비스는 Google AdSense를 포함한 제3자 광고 서비스를
                사용합니다. 이러한 광고 서비스는 사용자의 관심사에 맞는 광고를
                표시하기 위해 쿠키를 사용할 수 있습니다.
              </Paragraph>
              <Paragraph>
                Google의 광고 쿠키 사용에 대한 자세한 내용은{" "}
                <ExternalLink
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google 광고 정책
                </ExternalLink>
                에서 확인하실 수 있습니다.
              </Paragraph>
              <Paragraph>
                사용자는{" "}
                <ExternalLink
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google 광고 설정
                </ExternalLink>
                에서 맞춤 광고를 거부할 수 있습니다.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>5. 개인정보 보유 및 파기</SectionTitle>
            <SectionContent>
              <Paragraph>
                수집된 개인정보는 수집 목적이 달성되면 지체 없이 파기됩니다. 단,
                관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관됩니다.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>6. 개인정보 보호책임자</SectionTitle>
            <SectionContent>
              <Paragraph>
                개인정보 관련 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
              </Paragraph>
              <ContactBox>
                <ContactIcon>✉️</ContactIcon>
                <ContactEmail href="mailto:contact@dailynewspod.com">
                  contact@dailynewspod.com
                </ContactEmail>
              </ContactBox>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>7. 개인정보처리방침 변경</SectionTitle>
            <SectionContent>
              <Paragraph>
                본 개인정보처리방침은 법령 또는 서비스 정책의 변경에 따라 수정될
                수 있으며, 변경 시 서비스 내 공지를 통해 안내해 드립니다.
              </Paragraph>
            </SectionContent>
          </Section>
        </ContentSection>

        <BackToHome>
          <BackLink to="/">← 홈으로 돌아가기</BackLink>
        </BackToHome>
      </Main>

      <Footer>
        <FooterContent>
          <FooterLogo>
            <LogoIcon>🎙️</LogoIcon>
            <FooterLogoText>Daily News Podcast</FooterLogoText>
          </FooterLogo>
          <FooterLinks>
            <FooterLink to="/about">서비스 소개</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/contact">문의하기</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/privacy">개인정보처리방침</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/terms">이용약관</FooterLink>
          </FooterLinks>
          <FooterCopyright>
            © {new Date().getFullYear()} Daily News Podcast. All rights
            reserved.
          </FooterCopyright>
        </FooterContent>
      </Footer>
    </Container>
  );
}

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
