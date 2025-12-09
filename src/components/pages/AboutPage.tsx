import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

function AboutPage() {
  return (
    <Container>
      <Helmet>
        <title>서비스 소개 - Daily News Podcast | AI 뉴스 요약 팟캐스트</title>
        <meta
          name="description"
          content="Daily News Podcast는 AI 기술로 매일 주요 뉴스를 요약하고 음성으로 제공하는 무료 팟캐스트 서비스입니다. 출퇴근길, 운동 중에도 간편하게 뉴스를 들어보세요."
        />
        <meta
          name="keywords"
          content="Daily News Podcast, AI 뉴스 요약, 팟캐스트 서비스, 음성 뉴스, 뉴스 브리핑, 서비스 소개"
        />
        <link rel="canonical" href="https://dailynewspod.com/about" />
        <meta property="og:title" content="서비스 소개 - Daily News Podcast" />
        <meta
          property="og:description"
          content="AI 기술로 매일 주요 뉴스를 요약하고 음성으로 제공하는 무료 팟캐스트 서비스입니다."
        />
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
            <NavLink to="/">홈</NavLink>
            <NavLink to="/about" $active>
              소개
            </NavLink>
            <NavLink to="/contact">문의</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <HeroSection>
          <HeroIcon>🎙️</HeroIcon>
          <HeroTitle>Daily News Podcast</HeroTitle>
          <HeroSubtitle>AI가 요약한 오늘의 뉴스를 들어보세요</HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <Section>
            <SectionTitle>📰 서비스 소개</SectionTitle>
            <SectionContent>
              <Paragraph>
                Daily News Podcast는 매일 발행되는 주요 뉴스를 AI 기술을
                활용하여 요약하고, 자연스러운 음성으로 변환하여 제공하는
                서비스입니다.
              </Paragraph>
              <Paragraph>
                바쁜 일상 속에서 뉴스를 읽을 시간이 없는 분들을 위해,
                출퇴근길이나 운동 중에도 쉽게 들을 수 있는 오디오 형태로 뉴스를
                제공합니다.
              </Paragraph>
              <Paragraph>
                모든 콘텐츠는 <strong>완전 무료</strong>로 제공되며, 별도의 가입
                없이 바로 청취하실 수 있습니다.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>✨ 주요 특징</SectionTitle>
            <FeatureGrid>
              <FeatureCard>
                <FeatureIcon>🤖</FeatureIcon>
                <FeatureTitle>AI 뉴스 요약</FeatureTitle>
                <FeatureDescription>
                  최신 AI 기술로 핵심 내용만 간결하게 요약하여 제공합니다.
                  불필요한 내용은 제외하고 꼭 알아야 할 정보만 전달합니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🎧</FeatureIcon>
                <FeatureTitle>음성 변환</FeatureTitle>
                <FeatureDescription>
                  자연스러운 음성으로 편하게 청취할 수 있습니다. 눈이 피로할
                  때도 귀로 뉴스를 확인하세요.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📅</FeatureIcon>
                <FeatureTitle>매일 업데이트</FeatureTitle>
                <FeatureDescription>
                  매일 새로운 뉴스 요약이 제공됩니다. 최신 소식을 놓치지 않고
                  확인하실 수 있습니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📱</FeatureIcon>
                <FeatureTitle>어디서든 접속</FeatureTitle>
                <FeatureDescription>
                  PC, 태블릿, 스마트폰 등 모든 기기에서 이용 가능합니다. 반응형
                  디자인으로 편리하게 사용하세요.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📄</FeatureIcon>
                <FeatureTitle>대본 제공</FeatureTitle>
                <FeatureDescription>
                  모든 팟캐스트 에피소드에 대한 전체 대본을 제공합니다. 원하는
                  부분을 빠르게 찾아볼 수 있습니다.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>⏱️</FeatureIcon>
                <FeatureTitle>타임라인</FeatureTitle>
                <FeatureDescription>
                  주요 뉴스 항목별 타임라인을 제공하여 원하는 뉴스로 바로 이동할
                  수 있습니다.
                </FeatureDescription>
              </FeatureCard>
            </FeatureGrid>
          </Section>

          <Section>
            <SectionTitle>🎯 이런 분들께 추천드립니다</SectionTitle>
            <RecommendList>
              <RecommendItem>
                <RecommendIcon>🚗</RecommendIcon>
                <RecommendText>
                  출퇴근 시간을 활용해 뉴스를 듣고 싶은 분
                </RecommendText>
              </RecommendItem>
              <RecommendItem>
                <RecommendIcon>🏃</RecommendIcon>
                <RecommendText>
                  운동 중에도 세상 돌아가는 소식이 궁금한 분
                </RecommendText>
              </RecommendItem>
              <RecommendItem>
                <RecommendIcon>👀</RecommendIcon>
                <RecommendText>
                  눈의 피로 없이 뉴스를 접하고 싶은 분
                </RecommendText>
              </RecommendItem>
              <RecommendItem>
                <RecommendIcon>⏰</RecommendIcon>
                <RecommendText>
                  바쁜 일정 속 짧은 시간에 핵심 뉴스만 파악하고 싶은 분
                </RecommendText>
              </RecommendItem>
            </RecommendList>
          </Section>

          <Section>
            <SectionTitle>⚠️ 유의사항</SectionTitle>
            <NoticeBox>
              <NoticeItem>
                <NoticeIcon>ℹ️</NoticeIcon>
                <NoticeText>
                  본 서비스는 AI 기술을 활용하여 뉴스를 요약합니다. AI의 특성상
                  일부 오류가 있을 수 있으며, 정확한 정보는 원본 뉴스 출처를
                  확인해 주세요.
                </NoticeText>
              </NoticeItem>
              <NoticeItem>
                <NoticeIcon>📋</NoticeIcon>
                <NoticeText>
                  제공되는 콘텐츠는 참고용이며, 투자 등 중요한 결정에 앞서
                  반드시 원본 뉴스를 확인하시기 바랍니다.
                </NoticeText>
              </NoticeItem>
              <NoticeItem>
                <NoticeIcon>🗣️</NoticeIcon>
                <NoticeText>
                  AI 한국어 음성 기술은 아직 발전 중이며, 일부 발음이
                  부자연스러울 수 있습니다.
                </NoticeText>
              </NoticeItem>
            </NoticeBox>
          </Section>

          <Section>
            <SectionTitle>📬 문의하기</SectionTitle>
            <SectionContent>
              <Paragraph>
                서비스 이용 중 문의사항이나 피드백이 있으시면 언제든지 연락해
                주세요. 더 나은 서비스를 위해 여러분의 의견을 소중히 듣겠습니다.
              </Paragraph>
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
          <CTATitle>지금 바로 시작하세요!</CTATitle>
          <CTADescription>
            오늘의 뉴스를 AI가 요약해 드립니다. 무료로 들어보세요.
          </CTADescription>
          <CTAButton to="/">팟캐스트 듣기 →</CTAButton>
        </CTASection>
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
