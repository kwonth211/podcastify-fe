import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AboutPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container>
      <Helmet>
        <title>About - DailyNewsPodcast | Personalized AI News Podcast</title>
        <meta
          name="description"
          content="DailyNewsPodcast creates personalized AI-powered podcasts based on your interests. Get your custom news delivered daily."
        />
        <link rel="canonical" href="https://dailynewspodcast.com/about" />
      </Helmet>

      <Header>
        <HeaderContent>
          <Logo to="/">
            <LogoBox>D</LogoBox>
            <LogoText>DailyNewsPodcast</LogoText>
          </Logo>
          <Nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about" $active>
              About
            </NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <HeroSection>
          <HeroIcon>🎙️</HeroIcon>
          <HeroTitle>DailyNewsPodcast</HeroTitle>
          <HeroSubtitle>Your Personal AI News Anchor</HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <Section>
            <SectionTitle>📰 About the Service</SectionTitle>
            <SectionContent>
              <Paragraph>
                DailyNewsPodcast is a revolutionary service that creates
                personalized AI-powered podcasts based on your specific
                interests and preferences.
              </Paragraph>
              <Paragraph>
                Simply describe what topics you care about, and our AI agents
                crawl the web daily to curate, summarize, and deliver a custom
                news podcast straight to your inbox every morning.
              </Paragraph>
              <Paragraph>
                <strong>100% personalized, 0% fluff.</strong> No more scrolling
                through endless headlines—just listen to exactly what matters to
                you.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>✨ Key Features</SectionTitle>
            <FeatureGrid>
              <FeatureCard>
                <FeatureIcon>🎙️</FeatureIcon>
                <FeatureTitle>Natural AI Voices</FeatureTitle>
                <FeatureDescription>
                  High-fidelity neural voices deliver your news with emotion and
                  clarity. Choose from various accents and professional
                  personas.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>✍️</FeatureIcon>
                <FeatureTitle>Prompt-to-Script</FeatureTitle>
                <FeatureDescription>
                  Our AI agents crawl thousands of sources based on your prompts
                  and write cohesive, engaging radio scripts every day.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🏃</FeatureIcon>
                <FeatureTitle>Multitasking Hero</FeatureTitle>
                <FeatureDescription>
                  Stay informed while driving, running, or cooking. Hands-free
                  news tailored exactly to what you need.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>🧠</FeatureIcon>
                <FeatureTitle>Smart Summaries</FeatureTitle>
                <FeatureDescription>
                  We digest complex stories into tight, understandable summaries
                  so you're briefed in minutes, not hours.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>📡</FeatureIcon>
                <FeatureTitle>Private RSS Feed</FeatureTitle>
                <FeatureDescription>
                  Add your unique RSS link to Spotify, Apple Podcasts, or any
                  podcast player you prefer.
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon>⚡</FeatureIcon>
                <FeatureTitle>Zero-Click Automation</FeatureTitle>
                <FeatureDescription>
                  Set it and forget it. Your podcast is ready and waiting
                  exactly when you wake up, every single day.
                </FeatureDescription>
              </FeatureCard>
            </FeatureGrid>
          </Section>

          <Section>
            <SectionTitle>🎯 Perfect For</SectionTitle>
            <RecommendList>
              <RecommendItem>
                <RecommendIcon>🚗</RecommendIcon>
                <RecommendText>
                  Professionals who want to stay informed during their commute
                </RecommendText>
              </RecommendItem>
              <RecommendItem>
                <RecommendIcon>🏃</RecommendIcon>
                <RecommendText>
                  Fitness enthusiasts who like to learn while exercising
                </RecommendText>
              </RecommendItem>
              <RecommendItem>
                <RecommendIcon>📊</RecommendIcon>
                <RecommendText>
                  Investors tracking specific markets and companies
                </RecommendText>
              </RecommendItem>
              <RecommendItem>
                <RecommendIcon>🌍</RecommendIcon>
                <RecommendText>
                  Anyone who wants personalized news without the noise
                </RecommendText>
              </RecommendItem>
            </RecommendList>
          </Section>

          <Section>
            <SectionTitle>⚠️ Important Notes</SectionTitle>
            <NoticeBox>
              <NoticeItem>
                <NoticeIcon>ℹ️</NoticeIcon>
                <NoticeText>
                  This service uses AI technology to generate content. Due to
                  the nature of AI, there may be occasional errors. Please
                  verify important information from original sources.
                </NoticeText>
              </NoticeItem>
              <NoticeItem>
                <NoticeIcon>📋</NoticeIcon>
                <NoticeText>
                  The content provided is for reference only. For important
                  decisions, please check original news sources.
                </NoticeText>
              </NoticeItem>
            </NoticeBox>
          </Section>

          <Section>
            <SectionTitle>📬 Contact Us</SectionTitle>
            <SectionContent>
              <Paragraph>
                Have questions or feedback? We'd love to hear from you. Contact
                us anytime.
              </Paragraph>
            </SectionContent>
            <ContactBox>
              <ContactIcon>✉️</ContactIcon>
              <ContactEmail href="mailto:contact@dailynewspodcast.com">
                contact@dailynewspodcast.com
              </ContactEmail>
            </ContactBox>
          </Section>
        </ContentSection>

        <CTASection>
          <CTATitle>Get Started Now!</CTATitle>
          <CTADescription>
            Create your personalized AI news podcast today. It's free to try.
          </CTADescription>
          <CTAButton to="/">Create My Podcast →</CTAButton>
        </CTASection>
      </Main>

      <FooterSection>
        <FooterContent>
          <FooterLogo>
            <LogoBox>D</LogoBox>
            <FooterLogoText>DailyNewsPodcast</FooterLogoText>
          </FooterLogo>
          <FooterLinks>
            <FooterLink to="/about">About</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/terms">Terms</FooterLink>
          </FooterLinks>
          <FooterCopyright>
            © {currentYear} DailyNewsPodcast. All rights reserved.
          </FooterCopyright>
        </FooterContent>
      </FooterSection>
    </Container>
  );
};

export default AboutPage;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
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

const LogoBox = styled.div`
  width: 2rem;
  height: 2rem;
  background: #4f46e5;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(to right, #4f46e5, #2563eb);
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
  color: ${(props) => (props.$active ? "#4f46e5" : "#4b5563")};
  text-decoration: none;
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  font-size: 0.9375rem;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
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
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
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
  background: linear-gradient(to right, #4f46e5, #2563eb);
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
    border-color: #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
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
  background: linear-gradient(to right, #4f46e5, #2563eb);
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
  background: linear-gradient(to right, #4f46e5, #2563eb);
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
  color: #4f46e5;
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

const FooterSection = styled.footer`
  background: white;
  border-top: 1px solid #f3f4f6;
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
  color: #111827;
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
  color: #6b7280;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

const FooterDivider = styled.span`
  color: #d1d5db;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FooterCopyright = styled.p`
  font-size: 0.8125rem;
  color: #9ca3af;
  margin: 0;
`;
