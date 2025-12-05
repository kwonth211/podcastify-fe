import styled from "styled-components";

interface TermsProps {
  onClose: () => void;
}

function Terms({ onClose }: TermsProps) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>이용약관</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ModalBody>
          <LastUpdated>최종 수정일: 2024년 12월 1일</LastUpdated>

          <Section>
            <SectionTitle>제1조 (목적)</SectionTitle>
            <SectionContent>
              본 약관은 Daily News Podcast(이하 "서비스")가 제공하는 AI 뉴스
              요약 팟캐스트 서비스의 이용조건 및 절차, 이용자와 서비스 제공자의
              권리, 의무, 책임사항 등을 규정함을 목적으로 합니다.
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제2조 (서비스의 정의)</SectionTitle>
            <SectionContent>
              "서비스"란 인공지능(AI) 기술을 활용하여 뉴스를 요약하고, 이를
              음성으로 변환하여 제공하는 팟캐스트 서비스를 말합니다.
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제3조 (이용자의 의무)</SectionTitle>
            <SectionContent>
              이용자는 다음 행위를 해서는 안 됩니다:
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
              서비스는 서비스 운영을 위해 광고를 게재할 수 있으며, 이용자는
              서비스 이용 시 노출되는 광고 게재에 대해 동의합니다. 광고와
              관련하여 발생하는 거래는 광고주와 이용자 간의 문제이며, 서비스
              제공자는 이에 대해 책임을 지지 않습니다.
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제8조 (분쟁해결)</SectionTitle>
            <SectionContent>
              서비스 이용으로 발생한 분쟁에 대해 서비스 제공자와 이용자는 성실히
              협의하여 해결하며, 협의가 이루어지지 않을 경우 관할법원에 소송을
              제기할 수 있습니다.
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>제9조 (약관의 변경)</SectionTitle>
            <SectionContent>
              본 약관은 관계 법령 변경 또는 서비스 정책 변경에 따라 수정될 수
              있으며, 변경 시 서비스 내 공지를 통해 안내합니다. 변경된 약관에
              동의하지 않는 경우, 이용자는 서비스 이용을 중단할 수 있습니다.
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>부칙</SectionTitle>
            <SectionContent>
              본 약관은 2024년 12월 1일부터 시행됩니다.
            </SectionContent>
          </Section>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default Terms;

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

