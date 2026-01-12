import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ContactPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Container>
      <Helmet>
        <title>Contact - DailyNewsPodcast | Get in Touch</title>
        <meta
          name="description"
          content="Contact DailyNewsPodcast for inquiries, feedback, or partnership opportunities."
        />
        <link rel="canonical" href="https://dailynewspodcast.com/contact" />
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
            <NavLink to="/contact" $active>
              Contact
            </NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <PageHeader>
          <PageIcon>📬</PageIcon>
          <PageTitle>Contact Us</PageTitle>
          <PageSubtitle>
            We'd love to hear from you. Reach out anytime!
          </PageSubtitle>
        </PageHeader>

        <ContentSection>
          <ContactCard>
            <ContactCardHeader>
              <ContactCardIcon>✉️</ContactCardIcon>
              <ContactCardTitle>Email Us</ContactCardTitle>
            </ContactCardHeader>
            <ContactCardContent>
              <ContactEmail href="mailto:contact@dailynewspodcast.com">
                contact@dailynewspodcast.com
              </ContactEmail>
              <ContactDescription>
                General inquiries, service feedback, collaboration proposals—we
                welcome all messages.
                <br />
                We'll respond within 1-2 business days.
              </ContactDescription>
            </ContactCardContent>
          </ContactCard>

          <Section>
            <SectionTitle>💬 Frequently Asked Questions</SectionTitle>
            <FAQList>
              <FAQItem>
                <FAQQuestion>Is there a service fee?</FAQQuestion>
                <FAQAnswer>
                  We offer a free tier with basic features. Premium plans
                  starting at $19/month unlock additional podcasts, premium
                  voices, and advanced features.
                </FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>How often are podcasts delivered?</FAQQuestion>
                <FAQAnswer>
                  Free tier delivers weekly podcasts. Pro subscribers get daily
                  podcasts delivered to their inbox every morning.
                </FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>How accurate is the AI summary?</FAQQuestion>
                <FAQAnswer>
                  Our AI crawls thousands of sources and provides high-quality
                  summaries. However, we recommend verifying critical
                  information from original sources.
                </FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>Can I customize the voice?</FAQQuestion>
                <FAQAnswer>
                  Yes! Premium users can choose from multiple neural voices with
                  different accents and personas.
                </FAQAnswer>
              </FAQItem>
              <FAQItem>
                <FAQQuestion>
                  Can I use my own podcast app to listen?
                </FAQQuestion>
                <FAQAnswer>
                  Absolutely! Pro subscribers get a private RSS feed that works
                  with Spotify, Apple Podcasts, and any podcast player.
                </FAQAnswer>
              </FAQItem>
            </FAQList>
          </Section>

          <Section>
            <SectionTitle>📝 Contact Tips</SectionTitle>
            <InfoBox>
              <InfoItem>
                <InfoIcon>💡</InfoIcon>
                <InfoText>
                  Providing specific details helps us respond faster and more
                  effectively.
                </InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon>🔒</InfoIcon>
                <InfoText>
                  Your information is only used to respond to your inquiry and
                  is not shared.
                </InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon>⏰</InfoIcon>
                <InfoText>
                  We typically respond within 1-2 business days. Thank you for
                  your patience!
                </InfoText>
              </InfoItem>
            </InfoBox>
          </Section>

          <Section>
            <SectionTitle>🤝 Partnership Inquiries</SectionTitle>
            <SectionContent>
              <Paragraph>
                Interested in collaboration, advertising, or partnership with
                DailyNewsPodcast? We welcome various forms of partnership
                opportunities.
              </Paragraph>
            </SectionContent>
            <PartnershipBox>
              <PartnershipIcon>🤝</PartnershipIcon>
              <PartnershipEmail href="mailto:contact@dailynewspodcast.com">
                contact@dailynewspodcast.com
              </PartnershipEmail>
            </PartnershipBox>
          </Section>
        </ContentSection>

        <CTASection>
          <CTATitle>Ready to Get Started?</CTATitle>
          <CTADescription>
            Create your personalized AI news podcast today.
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

export default ContactPage;

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
  background: linear-gradient(to right, #4f46e5, #2563eb);
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
  color: #4f46e5;
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
  background: linear-gradient(to right, #4f46e5, #2563eb);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
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
