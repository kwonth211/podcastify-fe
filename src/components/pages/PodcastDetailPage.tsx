import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

// Mock data for MVP
const mockPodcastData: Record<string, {
  id: string;
  prompt: string;
  status: string;
  createdAt: string;
  duration: string | null;
  playCount: number;
  script: string;
  audioUrl: string | null;
}> = {
  "1": {
    id: "1",
    prompt: "Latest Apple and Tesla stock news with market analysis",
    status: "completed",
    createdAt: "2026-01-09T08:30:00Z",
    duration: "5:32",
    playCount: 12,
    script: `Good morning! Today we're diving into the latest movements in tech stocks, with a particular focus on Apple and Tesla.

Apple shares opened higher today, following the announcement of their new AI-powered features for the upcoming iPhone lineup. Analysts are particularly excited about the integration of on-device language models, which could significantly enhance user privacy while delivering powerful AI capabilities.

Meanwhile, Tesla continues to make waves in the EV market. The company reported record deliveries for the quarter, exceeding analyst expectations by 15%. However, concerns about increased competition from Chinese EV manufacturers have kept some investors cautious.

Looking at the broader market trends, tech stocks overall are showing resilience despite ongoing discussions about interest rate policies...`,
    audioUrl: "/sample-audio.mp3",
  },
  "2": {
    id: "2",
    prompt: "AI regulations in Europe and their impact on tech companies",
    status: "completed",
    createdAt: "2026-01-08T08:30:00Z",
    duration: "4:15",
    playCount: 8,
    script: `The European Union's AI Act is reshaping how technology companies operate across the continent. Today, we'll explore the latest developments and what they mean for the industry.

The new regulations introduce a risk-based framework for AI systems, categorizing them from minimal to unacceptable risk. High-risk applications, particularly in healthcare and critical infrastructure, now face stringent compliance requirements.

Major tech companies including Google, Microsoft, and OpenAI have been adapting their services to meet these new standards...`,
    audioUrl: "/sample-audio.mp3",
  },
  "3": {
    id: "3",
    prompt: "Nuclear fusion energy research breakthroughs this week",
    status: "generating",
    createdAt: "2026-01-09T10:00:00Z",
    duration: null,
    playCount: 0,
    script: "",
    audioUrl: null,
  },
  "4": {
    id: "4",
    prompt: "European weekend football results and highlights",
    status: "completed",
    createdAt: "2026-01-07T09:00:00Z",
    duration: "6:45",
    playCount: 23,
    script: `Welcome to your weekend football roundup! It was an action-packed weekend across Europe's top leagues, and we've got all the highlights for you.

In the Premier League, the title race continues to heat up. Manchester City secured a dominant 3-0 victory over Newcastle, with Haaland scoring twice to extend his remarkable scoring run...`,
    audioUrl: "/sample-audio.mp3",
  },
};

const PodcastDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const podcast = id ? mockPodcastData[id] : null;
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(podcast?.prompt || "");
  const [isPlaying, setIsPlaying] = useState(false);

  if (!podcast) {
    return (
      <Container>
        <Main>
          <NotFound>
            <NotFoundIcon>🔍</NotFoundIcon>
            <NotFoundTitle>{t("podcastDetail.notFound")}</NotFoundTitle>
            <NotFoundDescription>{t("podcastDetail.notFoundDescription")}</NotFoundDescription>
            <BackButton to="/my-podcasts">{t("podcastDetail.backToList")}</BackButton>
          </NotFound>
        </Main>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = () => {
    // MVP: Just close edit mode, actual API call would go here
    setIsEditing(false);
    // TODO: API call to update prompt
  };

  const handleRegenerate = () => {
    // MVP: Show confirmation, actual API call would go here
    if (window.confirm(t("podcastDetail.regenerateConfirm"))) {
      // TODO: API call to regenerate
      alert(t("podcastDetail.regenerateStarted"));
    }
  };

  const handleDelete = () => {
    if (window.confirm(t("podcastDetail.deleteConfirm"))) {
      // TODO: API call to delete
      navigate("/my-podcasts");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <StatusBadge $status="completed">{t("myPodcasts.statusCompleted")}</StatusBadge>;
      case "generating":
        return <StatusBadge $status="generating">{t("myPodcasts.statusGenerating")}</StatusBadge>;
      case "failed":
        return <StatusBadge $status="failed">{t("myPodcasts.statusFailed")}</StatusBadge>;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Helmet>
        <title>{t("podcastDetail.pageTitle")} - DailyNewsPodcast</title>
        <meta name="description" content={podcast.prompt} />
      </Helmet>

      <Header>
        <HeaderContent>
          <Logo to="/">
            <LogoBox>D</LogoBox>
            <LogoText>DailyNewsPodcast</LogoText>
          </Logo>
          <Nav>
            <NavLink to="/">{t("common.home")}</NavLink>
            <NavLink to="/my-podcasts">{t("myPodcasts.navTitle")}</NavLink>
          </Nav>
        </HeaderContent>
      </Header>

      <Main>
        <Breadcrumb>
          <BreadcrumbLink to="/my-podcasts">{t("myPodcasts.navTitle")}</BreadcrumbLink>
          <BreadcrumbSeparator>›</BreadcrumbSeparator>
          <BreadcrumbCurrent>{t("podcastDetail.detail")}</BreadcrumbCurrent>
        </Breadcrumb>

        <DetailCard>
          <DetailHeader>
            <HeaderLeft>
              <PodcastIcon>🎧</PodcastIcon>
              <HeaderInfo>
                <HeaderTitle>
                  {t("podcastDetail.podcastTitle", { id: podcast.id })}
                </HeaderTitle>
                <HeaderMeta>
                  {getStatusBadge(podcast.status)}
                  <MetaText>{formatDate(podcast.createdAt)}</MetaText>
                </HeaderMeta>
              </HeaderInfo>
            </HeaderLeft>
            <HeaderActions>
              <DeleteButton onClick={handleDelete}>
                🗑️ {t("podcastDetail.delete")}
              </DeleteButton>
            </HeaderActions>
          </DetailHeader>

          {/* Audio Player Section */}
          {podcast.status === "completed" && (
            <AudioSection>
              <AudioPlayer>
                <PlayButton
                  $isPlaying={isPlaying}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </PlayButton>
                <AudioInfo>
                  <AudioTitle>{t("podcastDetail.audioReady")}</AudioTitle>
                  <AudioDuration>
                    {podcast.duration} • {t("myPodcasts.playCount", { count: podcast.playCount })}
                  </AudioDuration>
                </AudioInfo>
                <ProgressBar>
                  <ProgressFill style={{ width: isPlaying ? "35%" : "0%" }} />
                </ProgressBar>
              </AudioPlayer>
            </AudioSection>
          )}

          {/* Generating State */}
          {podcast.status === "generating" && (
            <GeneratingSection>
              <GeneratingSpinner />
              <GeneratingText>{t("podcastDetail.generatingInProgress")}</GeneratingText>
              <GeneratingSubtext>{t("podcastDetail.generatingEstimate")}</GeneratingSubtext>
            </GeneratingSection>
          )}

          {/* Prompt Section */}
          <Section>
            <SectionHeader>
              <SectionTitle>📝 {t("podcastDetail.promptTitle")}</SectionTitle>
              {!isEditing && podcast.status === "completed" && (
                <EditButton onClick={() => setIsEditing(true)}>
                  ✏️ {t("podcastDetail.editPrompt")}
                </EditButton>
              )}
            </SectionHeader>

            {isEditing ? (
              <EditForm>
                <PromptTextarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  placeholder={t("podcastDetail.promptPlaceholder")}
                />
                <EditActions>
                  <CancelButton onClick={() => {
                    setIsEditing(false);
                    setEditedPrompt(podcast.prompt);
                  }}>
                    {t("podcastDetail.cancel")}
                  </CancelButton>
                  <SaveButton onClick={handleSave}>
                    {t("podcastDetail.save")}
                  </SaveButton>
                  <RegenerateButton onClick={handleRegenerate}>
                    🔄 {t("podcastDetail.regenerate")}
                  </RegenerateButton>
                </EditActions>
                <EditHint>{t("podcastDetail.editHint")}</EditHint>
              </EditForm>
            ) : (
              <PromptDisplay>{podcast.prompt}</PromptDisplay>
            )}
          </Section>

          {/* Script Section */}
          {podcast.script && (
            <Section>
              <SectionHeader>
                <SectionTitle>📄 {t("podcastDetail.scriptTitle")}</SectionTitle>
              </SectionHeader>
              <ScriptDisplay>{podcast.script}</ScriptDisplay>
            </Section>
          )}

          {/* Stats Section */}
          {podcast.status === "completed" && (
            <StatsSection>
              <StatCard>
                <StatValue>{podcast.playCount}</StatValue>
                <StatLabel>{t("podcastDetail.totalPlays")}</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{podcast.duration}</StatValue>
                <StatLabel>{t("podcastDetail.duration")}</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>
                  {new Date(podcast.createdAt).toLocaleDateString()}
                </StatValue>
                <StatLabel>{t("podcastDetail.created")}</StatLabel>
              </StatCard>
            </StatsSection>
          )}
        </DetailCard>
      </Main>

      <FooterSection>
        <FooterContent>
          <FooterLogo>
            <LogoBox>D</LogoBox>
            <FooterLogoText>DailyNewsPodcast</FooterLogoText>
          </FooterLogo>
          <FooterLinks>
            <FooterLink to="/about">{t("common.about")}</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/contact">{t("common.contact")}</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/privacy">{t("common.privacy")}</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/terms">{t("common.terms")}</FooterLink>
          </FooterLinks>
          <FooterCopyright>
            {t("common.copyright", { year: currentYear })}
          </FooterCopyright>
        </FooterContent>
      </FooterSection>
    </Container>
  );
};

export default PodcastDetailPage;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f0f23 0%, #1a1a2e 100%);
`;

const Header = styled.header`
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(to right, #4f46e5, #818cf8);
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
  color: ${(props) => (props.$active ? "#818cf8" : "rgba(255, 255, 255, 0.7)")};
  text-decoration: none;
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  font-size: 0.9375rem;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #818cf8;
  }
`;

const Main = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const BreadcrumbLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.875rem;

  &:hover {
    color: #818cf8;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: rgba(255, 255, 255, 0.4);
`;

const BreadcrumbCurrent = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
`;

const DetailCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 1rem;
`;

const PodcastIcon = styled.div`
  font-size: 2.5rem;
`;

const HeaderInfo = styled.div``;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;

  ${(props) => {
    switch (props.$status) {
      case "completed":
        return `
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        `;
      case "generating":
        return `
          background: rgba(234, 179, 8, 0.2);
          color: #fbbf24;
        `;
      case "failed":
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
        `;
      default:
        return "";
    }
  }}
`;

const MetaText = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`;

const AudioSection = styled.div`
  margin-bottom: 2rem;
`;

const AudioPlayer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%);
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 16px;
  padding: 1.25rem;
`;

const PlayButton = styled.button<{ $isPlaying: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
  }
`;

const AudioInfo = styled.div`
  flex: 1;
`;

const AudioTitle = styled.div`
  color: white;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const AudioDuration = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(to right, #4f46e5, #818cf8);
  border-radius: 3px;
  transition: width 0.3s;
`;

const GeneratingSection = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.2);
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const GeneratingSpinner = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  border: 3px solid rgba(251, 191, 36, 0.3);
  border-top-color: #fbbf24;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const GeneratingText = styled.p`
  color: #fbbf24;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const GeneratingSubtext = styled.p`
  color: rgba(251, 191, 36, 0.7);
  font-size: 0.875rem;
  margin: 0;
`;

const Section = styled.section`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const EditButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const PromptDisplay = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
`;

const EditForm = styled.div``;

const PromptTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  line-height: 1.7;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(to right, #4f46e5, #6366f1);
  border: none;
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(79, 70, 229, 0.4);
  }
`;

const RegenerateButton = styled.button`
  background: rgba(234, 179, 8, 0.2);
  border: 1px solid rgba(234, 179, 8, 0.3);
  color: #fbbf24;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(234, 179, 8, 0.3);
  }
`;

const EditHint = styled.p`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8125rem;
  margin: 0.75rem 0 0 0;
`;

const ScriptDisplay = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(129, 140, 248, 0.3);
    border-radius: 3px;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
`;

const NotFound = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const NotFoundIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const NotFoundTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
`;

const NotFoundDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 1.5rem 0;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(to right, #4f46e5, #6366f1);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
  }
`;

const FooterSection = styled.footer`
  background: rgba(15, 15, 35, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  color: white;
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
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #818cf8;
  }
`;

const FooterDivider = styled.span`
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FooterCopyright = styled.p`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
`;
