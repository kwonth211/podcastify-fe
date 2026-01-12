import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PrivacyPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container>
      <Helmet>
        <title>Privacy Policy - DailyNewsPodcast</title>
        <meta
          name="description"
          content="Privacy Policy of DailyNewsPodcast - Your personalized AI news podcast service."
        />
        <link rel="canonical" href="https://dailynewspodcast.com/privacy" />
      </Helmet>

      <Header>
        <HeaderContent>
          <Logo to="/">
            <LogoBox>D</LogoBox>
            <LogoText>DailyNewsPodcast</LogoText>
          </Logo>
          <Nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <PageHeader>
          <PageTitle>Privacy Policy</PageTitle>
          <LastUpdated>Last updated: January 9, 2026</LastUpdated>
        </PageHeader>

        <ContentSection>
          <Section>
            <SectionTitle>1. Information We Collect</SectionTitle>
            <SectionContent>
              <Paragraph>
                DailyNewsPodcast ("Service") may collect the following
                information to provide our services:
              </Paragraph>
              <List>
                <ListItem>
                  <strong>Automatically Collected Information:</strong> IP
                  address, browser type, access time, service usage records
                </ListItem>
                <ListItem>
                  <strong>Cookie Information:</strong> User preferences, session
                  information
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>2. Purpose of Collection and Use</SectionTitle>
            <SectionContent>
              <Paragraph>
                The collected information is used for the following purposes:
              </Paragraph>
              <List>
                <ListItem>Service provision and operation</ListItem>
                <ListItem>
                  Service improvement and user experience optimization
                </ListItem>
                <ListItem>
                  Statistical analysis and service quality improvement
                </ListItem>
                <ListItem>Advertising and personalized ad delivery</ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>3. Use of Cookies</SectionTitle>
            <SectionContent>
              <Paragraph>
                This service uses cookies to improve user experience. Cookies
                are small text files that websites store on your computer.
              </Paragraph>
              <Paragraph>
                <strong>Cookie Usage Purposes:</strong>
              </Paragraph>
              <List>
                <ListItem>Storing user preferences</ListItem>
                <ListItem>Collecting service usage statistics</ListItem>
                <ListItem>Measuring advertising effectiveness</ListItem>
              </List>
              <Paragraph>
                You can refuse cookie storage through your browser settings, but
                this may limit some service functionality.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>4. Third-Party Advertising Services</SectionTitle>
            <SectionContent>
              <Paragraph>
                This service uses third-party advertising services including
                Google AdSense. These advertising services may use cookies to
                display ads that match your interests.
              </Paragraph>
              <Paragraph>
                For more information about Google's use of advertising cookies,
                please visit{" "}
                <ExternalLink
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Advertising Policies
                </ExternalLink>
                .
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>
              5. Retention and Destruction of Personal Information
            </SectionTitle>
            <SectionContent>
              <Paragraph>
                Collected personal information is destroyed without delay once
                the purpose of collection is achieved. However, if retention is
                required by relevant laws, it will be stored for the applicable
                period.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>6. Privacy Officer</SectionTitle>
            <SectionContent>
              <Paragraph>
                For privacy-related inquiries, please contact us at:
              </Paragraph>
              <ContactBox>
                <ContactIcon>✉️</ContactIcon>
                <ContactEmail href="mailto:contact@dailynewspodcast.com">
                  contact@dailynewspodcast.com
                </ContactEmail>
              </ContactBox>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>7. Changes to Privacy Policy</SectionTitle>
            <SectionContent>
              <Paragraph>
                This Privacy Policy may be modified according to changes in laws
                or service policies. Changes will be announced through service
                notifications.
              </Paragraph>
            </SectionContent>
          </Section>
        </ContentSection>

        <BackToHome>
          <BackLink to="/">← Back to Home</BackLink>
        </BackToHome>
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

export default PrivacyPage;

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

const NavLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
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
  color: #4f46e5;
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
  color: #4f46e5;
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
  color: #4f46e5;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #4338ca;
  }
`;

const FooterSection = styled.footer`
  background: white;
  border-top: 1px solid #f3f4f6;
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
