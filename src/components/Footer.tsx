import { Link } from "react-router-dom";
import styled from "styled-components";

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLogo>
          <LogoIcon>🎙️</LogoIcon>
          <LogoText>Daily News Podcast</LogoText>
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

        <FooterInfo>
          <FooterContact>
            <ContactItem>
              <ContactIcon>✉️</ContactIcon>
              <ContactText>contact@dailynewspod.com</ContactText>
            </ContactItem>
          </FooterContact>
        </FooterInfo>

        <FooterCopyright>
          © {new Date().getFullYear()} Daily News Podcast. All rights reserved.
        </FooterCopyright>

        <FooterDisclaimer>
          본 서비스는 AI 기술을 활용하여 뉴스를 요약하고 음성으로 제공합니다.
          <br />
          제공되는 콘텐츠는 참고용이며, 정확한 정보는 원본 뉴스 출처를 확인해
          주세요.
        </FooterDisclaimer>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  padding: 3rem 2rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin-top: 3rem;
  }
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
  gap: 0.75rem;
`;

const LogoIcon = styled.span`
  font-size: 1.75rem;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
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
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #667eea;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const FooterDivider = styled.span`
  color: #cbd5e1;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FooterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterContact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
`;

const ContactIcon = styled.span`
  font-size: 0.875rem;
`;

const ContactText = styled.span`
  font-size: 0.875rem;
  color: #64748b;
`;

const FooterCopyright = styled.p`
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0;
`;

const FooterDisclaimer = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.6;
  max-width: 500px;
`;
