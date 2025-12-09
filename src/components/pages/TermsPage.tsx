import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

function TermsPage() {
  return (
    <Container>
      <Helmet>
        <title>이용약관 - Daily News Podcast</title>
        <meta
          name="description"
          content="Daily News Podcast 이용약관입니다. 서비스 이용조건, 이용자 의무, 콘텐츠 저작권, 면책조항 등에 대한 안내입니다."
        />
        <meta
          name="keywords"
          content="Daily News Podcast, 이용약관, 서비스 약관, 이용조건"
        />
        <link rel="canonical" href="https://dailynewspod.com/terms" />
        <meta property="og:title" content="이용약관 - Daily News Podcast" />
        <meta
          property="og:description"
          content="Daily News Podcast 이용약관입니다."
        />
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
            <NavLink to="/">홈</NavLink>
            <NavLink to="/about">소개</NavLink>
            <NavLink to="/contact">문의</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <PageHeader>
          <PageTitle>이용약관</PageTitle>
          <LastUpdated>최종 수정일: 2024년 12월 1일</LastUpdated>
        </PageHeader>

        <ContentSection>
          <Section>
            <SectionTitle>제1조 (목적)</SectionTitle>
            <SectionContent>
              <Paragraph>
                본 약관은 Daily News Podcast(이하 "서비스")가 제공하는 AI 뉴스
                요약 팟캐스트 서비스의 이용조건 및 절차, 이용자와 서비스
                제공자의 권리, 의무, 책임사항 등을 규정함을 목적으로 합니다.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제2조 (서비스의 정의)</SectionTitle>
            <SectionContent>
              <Paragraph>
                "서비스"란 인공지능(AI) 기술을 활용하여 뉴스를 요약하고, 이를
                음성으로 변환하여 제공하는 팟캐스트 서비스를 말합니다.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제3조 (이용자의 의무)</SectionTitle>
            <SectionContent>
              <Paragraph>이용자는 다음 행위를 해서는 안 됩니다:</Paragraph>
              <List>
                <ListItem>서비스의 정상적인 운영을 방해하는 행위</ListItem>
                <ListItem>
                  타인의 명예를 손상시키거나 불이익을 주는 행위
                </ListItem>
                <ListItem>
                  서비스를 통해 제공받은 콘텐츠를 무단으로 복제, 배포, 판매하는
                  행위
                </ListItem>
                <ListItem>기타 관계 법령에 위배되는 행위</ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제4조 (서비스 제공 및 변경)</SectionTitle>
            <SectionContent>
              <List>
                <ListItem>
                  서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.
                </ListItem>
                <ListItem>
                  서비스 제공자는 기술적 사양의 변경, 시스템 점검 등의 필요에
                  따라 서비스를 일시적으로 중단할 수 있습니다.
                </ListItem>
                <ListItem>
                  서비스 내용의 변경이 있는 경우, 서비스 내 공지를 통해
                  안내합니다.
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제5조 (콘텐츠의 저작권)</SectionTitle>
            <SectionContent>
              <List>
                <ListItem>
                  서비스에서 제공하는 AI 생성 콘텐츠의 저작권은 서비스
                  제공자에게 있습니다.
                </ListItem>
                <ListItem>
                  이용자는 개인적이고 비상업적인 용도로만 콘텐츠를 이용할 수
                  있습니다.
                </ListItem>
                <ListItem>
                  원본 뉴스의 저작권은 해당 뉴스 제공자에게 있으며, 서비스는
                  뉴스를 요약하여 제공하는 것입니다.
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제6조 (면책조항)</SectionTitle>
            <SectionContent>
              <List>
                <ListItem>
                  <strong>AI 생성 콘텐츠 한계:</strong> 본 서비스는 AI 기술을
                  활용하여 콘텐츠를 생성합니다. AI의 특성상 오류, 부정확한
                  정보가 포함될 수 있으며, 이로 인한 손해에 대해 서비스 제공자는
                  책임을 지지 않습니다.
                </ListItem>
                <ListItem>
                  <strong>정보의 정확성:</strong> 제공되는 뉴스 요약은
                  참고용이며, 정확한 정보는 원본 뉴스 출처를 확인하시기
                  바랍니다.
                </ListItem>
                <ListItem>
                  <strong>서비스 중단:</strong> 천재지변, 시스템 장애 등
                  불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지
                  않습니다.
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제7조 (광고 게재)</SectionTitle>
            <SectionContent>
              <Paragraph>
                서비스는 서비스 운영을 위해 광고를 게재할 수 있으며, 이용자는
                서비스 이용 시 노출되는 광고 게재에 대해 동의합니다. 광고와
                관련하여 발생하는 거래는 광고주와 이용자 간의 문제이며, 서비스
                제공자는 이에 대해 책임을 지지 않습니다.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제8조 (분쟁해결)</SectionTitle>
            <SectionContent>
              <Paragraph>
                서비스 이용으로 발생한 분쟁에 대해 서비스 제공자와 이용자는
                성실히 협의하여 해결하며, 협의가 이루어지지 않을 경우 관할법원에
                소송을 제기할 수 있습니다.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제9조 (약관의 변경)</SectionTitle>
            <SectionContent>
              <Paragraph>
                본 약관은 관계 법령 변경 또는 서비스 정책 변경에 따라 수정될 수
                있으며, 변경 시 서비스 내 공지를 통해 안내합니다. 변경된 약관에
                동의하지 않는 경우, 이용자는 서비스 이용을 중단할 수 있습니다.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>부칙</SectionTitle>
            <SectionContent>
              <Paragraph>본 약관은 2024년 12월 1일부터 시행됩니다.</Paragraph>
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
