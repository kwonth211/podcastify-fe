import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

function ContactPage() {
  return (
    <Container>
      <Helmet>
        <title>문의하기 - Daily News Podcast | 연락처 및 피드백</title>
        <meta
          name="description"
          content="Daily News Podcast에 문의사항이나 피드백이 있으시면 연락주세요. 서비스 개선을 위한 여러분의 소중한 의견을 기다립니다."
        />
        <meta
          name="keywords"
          content="Daily News Podcast, 문의, 연락처, 피드백, 고객센터, 서비스 문의"
        />
        <link rel="canonical" href="https://dailynewspod.com/contact" />
        <meta property="og:title" content="문의하기 - Daily News Podcast" />
        <meta
          property="og:description"
          content="Daily News Podcast에 문의사항이나 피드백이 있으시면 연락주세요."
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
            <NavLink to="/">홈</NavLink>
            <NavLink to="/about">소개</NavLink>
            <NavLink to="/contact" $active>
              문의
            </NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <PageHeader>
          <PageIcon>📬</PageIcon>
          <PageTitle>문의하기</PageTitle>
          <PageSubtitle>
            서비스 이용 중 문의사항이나 피드백이 있으시면 연락주세요
          </PageSubtitle>
        </PageHeader>

        <ContentSection>
          <ContactCard>
            <ContactCardHeader>
              <ContactCardIcon>✉️</ContactCardIcon>
              <ContactCardTitle>이메일 문의</ContactCardTitle>
            </ContactCardHeader>
            <ContactCardContent>
              <ContactEmail href="mailto:contact@dailynewspod.com">
                contact@dailynewspod.com
              </ContactEmail>
              <ContactDescription>
                일반적인 문의사항, 서비스 피드백, 협업 제안 등 모든 문의를
                환영합니다.
                <br />
                보내주신 이메일은 영업일 기준 1-2일 내에 답변드리겠습니다.
              </ContactDescription>
            </ContactCardContent>
          </ContactCard>

          <Section>
            <SectionTitle>💬 자주 묻는 질문</SectionTitle>
            <FAQList>
              <FAQItem>
                <FAQQuestion>서비스 이용 요금이 있나요?</FAQQuestion>
                <FAQAnswer>
                  아니요, Daily News Podcast는 완전 무료 서비스입니다. 별도의
                  가입이나 결제 없이 모든 콘텐츠를 이용하실 수 있습니다.
                </FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>
                  팟캐스트는 얼마나 자주 업데이트되나요?
                </FAQQuestion>
                <FAQAnswer>
                  매일 새로운 뉴스 요약 팟캐스트가 업로드됩니다. 최신 뉴스를
                  놓치지 않고 들을 수 있습니다.
                </FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>AI 요약의 정확도는 어느 정도인가요?</FAQQuestion>
                <FAQAnswer>
                  AI 기술의 특성상 간혹 오류가 있을 수 있습니다. 중요한 정보는
                  원본 뉴스 출처를 확인하시는 것을 권장합니다.
                </FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>모바일에서도 이용 가능한가요?</FAQQuestion>
                <FAQAnswer>
                  네, 반응형 웹으로 제작되어 PC, 태블릿, 스마트폰 등 모든
                  기기에서 편리하게 이용하실 수 있습니다.
                </FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>대본(스크립트)도 볼 수 있나요?</FAQQuestion>
                <FAQAnswer>
                  네, 모든 팟캐스트 에피소드에 대해 전체 대본을 제공합니다. 각
                  에피소드 페이지에서 확인하실 수 있습니다.
                </FAQAnswer>
              </FAQItem>
            </FAQList>
          </Section>

          <Section>
            <SectionTitle>📝 문의 시 참고사항</SectionTitle>
            <InfoBox>
              <InfoItem>
                <InfoIcon>💡</InfoIcon>
                <InfoText>
                  문의 내용에 구체적인 상황을 설명해 주시면 더 빠른 답변이
                  가능합니다.
                </InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon>🔒</InfoIcon>
                <InfoText>
                  개인정보는 문의 응대 목적으로만 사용되며, 응대 완료 후
                  파기됩니다.
                </InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon>⏰</InfoIcon>
                <InfoText>
                  답변은 영업일 기준 1-2일 내에 드리고 있습니다. 양해
                  부탁드립니다.
                </InfoText>
              </InfoItem>
            </InfoBox>
          </Section>

          <Section>
            <SectionTitle>🤝 협업 및 제휴 문의</SectionTitle>
            <SectionContent>
              <Paragraph>
                Daily News Podcast와의 협업, 광고, 제휴에 관심이 있으시면 아래
                이메일로 연락주세요. 다양한 형태의 파트너십을 환영합니다.
              </Paragraph>
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
          <CTATitle>지금 바로 뉴스를 들어보세요</CTATitle>
          <CTADescription>
            AI가 요약한 오늘의 뉴스 팟캐스트를 확인해보세요.
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
