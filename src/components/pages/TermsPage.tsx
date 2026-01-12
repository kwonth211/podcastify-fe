import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

const TermsPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container>
      <Helmet>
        <title>Terms of Service - DailyNewsPodcast</title>
        <meta
          name="description"
          content="Terms of Service for DailyNewsPodcast - Your personalized AI news podcast service."
        />
        <link rel="canonical" href="https://dailynewspodcast.com/terms" />
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
          <PageTitle>Terms of Service</PageTitle>
          <LastUpdated>Last updated: January 9, 2026</LastUpdated>
        </PageHeader>

        <ContentSection>
          <Section>
            <SectionTitle>Article 1 (Purpose)</SectionTitle>
            <SectionContent>
              <Paragraph>
                These Terms of Service govern the conditions, procedures,
                rights, obligations, and responsibilities between users and
                DailyNewsPodcast ("Service") for the personalized AI news
                podcast service.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Article 2 (Definition of Service)</SectionTitle>
            <SectionContent>
              <Paragraph>
                "Service" refers to a personalized podcast service that uses
                artificial intelligence (AI) technology to crawl news based on
                user preferences, summarize content, and convert it into audio
                format for daily delivery.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Article 3 (User Obligations)</SectionTitle>
            <SectionContent>
              <Paragraph>Users must not engage in the following:</Paragraph>
              <List>
                <ListItem>
                  Actions that interfere with normal service operation
                </ListItem>
                <ListItem>
                  Actions that damage others' reputation or cause harm
                </ListItem>
                <ListItem>
                  Unauthorized reproduction, distribution, or sale of content
                  received through the service
                </ListItem>
                <ListItem>Other actions that violate relevant laws</ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>
              Article 4 (Service Provision and Changes)
            </SectionTitle>
            <SectionContent>
              <List>
                <ListItem>
                  The service is provided 24 hours a day, 365 days a year in
                  principle.
                </ListItem>
                <ListItem>
                  The service provider may temporarily suspend the service due
                  to technical changes, system maintenance, etc.
                </ListItem>
                <ListItem>
                  If there are changes to the service content, we will notify
                  you through service announcements.
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Article 5 (Copyright of Content)</SectionTitle>
            <SectionContent>
              <List>
                <ListItem>
                  The copyright of AI-generated content provided by the service
                  belongs to the service provider.
                </ListItem>
                <ListItem>
                  Users may only use the content for personal and non-commercial
                  purposes.
                </ListItem>
                <ListItem>
                  The copyright of original news belongs to the respective news
                  providers; the service summarizes and provides the news.
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Article 6 (Disclaimer)</SectionTitle>
            <SectionContent>
              <List>
                <ListItem>
                  <strong>AI-Generated Content Limitations:</strong> This
                  service generates content using AI technology. Due to the
                  nature of AI, errors and inaccurate information may be
                  included, and the service provider is not responsible for any
                  resulting damages.
                </ListItem>
                <ListItem>
                  <strong>Accuracy of Information:</strong> News summaries
                  provided are for reference only. Please verify accurate
                  information from original news sources.
                </ListItem>
                <ListItem>
                  <strong>Service Interruption:</strong> We are not responsible
                  for service interruptions due to force majeure such as natural
                  disasters or system failures.
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Article 7 (Advertising)</SectionTitle>
            <SectionContent>
              <Paragraph>
                The service may display advertisements for service operation,
                and users agree to the display of advertisements while using the
                service. Transactions related to advertisements are matters
                between advertisers and users, and the service provider is not
                responsible for them.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Article 8 (Dispute Resolution)</SectionTitle>
            <SectionContent>
              <Paragraph>
                The service provider and users shall sincerely negotiate to
                resolve disputes arising from service use. If negotiation fails,
                litigation may be filed with the competent court.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Article 9 (Changes to Terms)</SectionTitle>
            <SectionContent>
              <Paragraph>
                These Terms may be modified according to changes in relevant
                laws or service policies. Changes will be announced through
                service notifications. If you do not agree to the changed terms,
                you may discontinue use of the service.
              </Paragraph>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Supplementary Provisions</SectionTitle>
            <SectionContent>
              <Paragraph>
                These Terms take effect from January 9, 2026.
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

export default TermsPage;

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
