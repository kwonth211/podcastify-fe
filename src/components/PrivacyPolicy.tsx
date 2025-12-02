import styled from "styled-components";

interface PrivacyPolicyProps {
  onClose: () => void;
}

function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>개인정보처리방침</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ModalBody>
          <LastUpdated>최종 수정일: 2024년 12월 1일</LastUpdated>

          <Section>
            <SectionTitle>1. 개인정보 수집 항목</SectionTitle>
            <SectionContent>
              Daily News Podcast(이하 "서비스")는 서비스 제공을 위해 다음과 같은
              정보를 수집할 수 있습니다:
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
              수집된 정보는 다음 목적으로 이용됩니다:
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
              본 서비스는 사용자 경험 개선을 위해 쿠키를 사용합니다. 쿠키는
              웹사이트가 사용자의 컴퓨터에 저장하는 작은 텍스트 파일입니다.
              <br />
              <br />
              <strong>쿠키 사용 목적:</strong>
              <List>
                <ListItem>사용자 환경 설정 저장</ListItem>
                <ListItem>서비스 이용 통계 수집</ListItem>
                <ListItem>광고 효과 측정</ListItem>
              </List>
              사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이
              경우 서비스 이용에 일부 제한이 있을 수 있습니다.
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>4. 제3자 광고 서비스</SectionTitle>
            <SectionContent>
              본 서비스는 Google AdSense를 포함한 제3자 광고 서비스를
              사용합니다. 이러한 광고 서비스는 사용자의 관심사에 맞는 광고를
              표시하기 위해 쿠키를 사용할 수 있습니다.
              <br />
              <br />
              Google의 광고 쿠키 사용에 대한 자세한 내용은{" "}
              <ExternalLink
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google 광고 정책
              </ExternalLink>
              에서 확인하실 수 있습니다.
              <br />
              <br />
              사용자는{" "}
              <ExternalLink
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google 광고 설정
              </ExternalLink>
              에서 맞춤 광고를 거부할 수 있습니다.
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>5. 개인정보 보유 및 파기</SectionTitle>
            <SectionContent>
              수집된 개인정보는 수집 목적이 달성되면 지체 없이 파기됩니다. 단,
              관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관됩니다.
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>6. 개인정보 보호책임자</SectionTitle>
            <SectionContent>
              개인정보 관련 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
              <List>
                <ListItem>
                  <strong>이메일:</strong> contact@dailynewspod.com
                </ListItem>
              </List>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>7. 개인정보처리방침 변경</SectionTitle>
            <SectionContent>
              본 개인정보처리방침은 법령 또는 서비스 정책의 변경에 따라 수정될
              수 있으며, 변경 시 서비스 내 공지를 통해 안내해 드립니다.
            </SectionContent>
          </Section>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default PrivacyPolicy;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    border-radius: 16px;
    max-height: 90vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const LastUpdated = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Section = styled.section`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.75rem 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SectionContent = styled.div`
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const List = styled.ul`
  margin: 0.75rem 0;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.6;

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
