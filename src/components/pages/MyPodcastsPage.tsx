import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Navbar from "../dailyprompt/Navbar";
import Footer from "../dailyprompt/Footer";

// Mock data for MVP
const mockPodcasts = [
  {
    id: "1",
    prompt: "Latest Apple and Tesla stock news with market analysis",
    status: "completed",
    createdAt: "2026-01-09T08:30:00Z",
    duration: "5:32",
    playCount: 12,
  },
  {
    id: "2",
    prompt: "AI regulations in Europe and their impact on tech companies",
    status: "completed",
    createdAt: "2026-01-08T08:30:00Z",
    duration: "4:15",
    playCount: 8,
  },
  {
    id: "3",
    prompt: "Nuclear fusion energy research breakthroughs this week",
    status: "generating",
    createdAt: "2026-01-09T10:00:00Z",
    duration: null,
    playCount: 0,
  },
  {
    id: "4",
    prompt: "European weekend football results and highlights",
    status: "completed",
    createdAt: "2026-01-07T09:00:00Z",
    duration: "6:45",
    playCount: 23,
  },
  {
    id: "5",
    prompt: "2025년 1월 9일 사회 뉴스 요약",
    status: "completed",
    createdAt: "2026-01-09T07:00:00Z",
    duration: "8:12",
    playCount: 15,
  },
  {
    id: "6",
    prompt: "Latest cryptocurrency market trends and Bitcoin analysis",
    status: "completed",
    createdAt: "2026-01-06T09:00:00Z",
    duration: "7:30",
    playCount: 31,
  },
];

const MyPodcastsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  // 필터링 및 검색
  const filteredPodcasts = mockPodcasts.filter((podcast) => {
    const matchesSearch = podcast.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === null || podcast.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 통계 계산
  const stats = {
    total: mockPodcasts.length,
    completed: mockPodcasts.filter((p) => p.status === "completed").length,
    generating: mockPodcasts.filter((p) => p.status === "generating").length,
    totalPlays: mockPodcasts.reduce((sum, p) => sum + p.playCount, 0),
  };

  return (
    <Container>
      <Helmet>
        <title>{t("myPodcasts.pageTitle")} - DailyNewsPodcast</title>
        <meta name="description" content={t("myPodcasts.pageDescription")} />
      </Helmet>
      <Navbar />
      <Main>
        {/* 대시보드 헤더 */}
        <DashboardHeader>
          <HeaderLeft>
            <PageTitle>{t("myPodcasts.title")}</PageTitle>
            <PageSubtitle>{t("myPodcasts.subtitle")}</PageSubtitle>
          </HeaderLeft>
          <CreateButton to="/#create">{t("myPodcasts.createNew")}</CreateButton>
        </DashboardHeader>

        {/* 통계 카드 */}
        <StatsGrid>
          <StatCard>
            <StatIcon>📊</StatIcon>
            <StatContent>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>{t("myPodcasts.stats.total")}</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>✅</StatIcon>
            <StatContent>
              <StatValue>{stats.completed}</StatValue>
              <StatLabel>{t("myPodcasts.stats.completed")}</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>⏳</StatIcon>
            <StatContent>
              <StatValue>{stats.generating}</StatValue>
              <StatLabel>{t("myPodcasts.stats.generating")}</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>▶️</StatIcon>
            <StatContent>
              <StatValue>{stats.totalPlays}</StatValue>
              <StatLabel>{t("myPodcasts.stats.totalPlays")}</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* 필터 및 검색 바 */}
        <Toolbar>
          <SearchBar>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder={t("myPodcasts.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <ClearButton onClick={() => setSearchQuery("")}>✕</ClearButton>
            )}
          </SearchBar>
          <FilterGroup>
            <FilterButton
              $active={statusFilter === null}
              onClick={() => setStatusFilter(null)}
            >
              {t("myPodcasts.filters.all")}
            </FilterButton>
            <FilterButton
              $active={statusFilter === "completed"}
              onClick={() => setStatusFilter("completed")}
            >
              {t("myPodcasts.statusCompleted")}
            </FilterButton>
            <FilterButton
              $active={statusFilter === "generating"}
              onClick={() => setStatusFilter("generating")}
            >
              {t("myPodcasts.statusGenerating")}
            </FilterButton>
          </FilterGroup>
          <ViewToggle>
            <ViewButton
              $active={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              title={t("myPodcasts.viewGrid")}
            >
              ⊞
            </ViewButton>
            <ViewButton
              $active={viewMode === "list"}
              onClick={() => setViewMode("list")}
              title={t("myPodcasts.viewList")}
            >
              ☰
            </ViewButton>
          </ViewToggle>
        </Toolbar>

        {/* 결과 카운트 */}
        <ResultsInfo>
          {filteredPodcasts.length === 0 ? (
            <EmptyMessage>{t("myPodcasts.noResults")}</EmptyMessage>
          ) : (
            <ResultsCount>
              {t("myPodcasts.resultsCount", { count: filteredPodcasts.length })}
            </ResultsCount>
          )}
        </ResultsInfo>

        {/* 팟캐스트 그리드/리스트 */}
        {filteredPodcasts.length === 0 && searchQuery === "" && statusFilter === null ? (
          <EmptyState>
            <EmptyIcon>🎙️</EmptyIcon>
            <EmptyTitle>{t("myPodcasts.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("myPodcasts.emptyDescription")}</EmptyDescription>
            <CreateButton to="/#create">{t("myPodcasts.createFirst")}</CreateButton>
          </EmptyState>
        ) : (
          <PodcastContainer $viewMode={viewMode}>
            {filteredPodcasts.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                onClick={() => navigate(`/my-podcasts/${podcast.id}`)}
                $viewMode={viewMode}
              >
                <CardHeader>
                  <CardIcon>🎧</CardIcon>
                  {getStatusBadge(podcast.status)}
                </CardHeader>
                <CardPrompt>{podcast.prompt}</CardPrompt>
                <CardMeta>
                  <MetaItem>
                    <MetaIcon>📅</MetaIcon>
                    {formatDate(podcast.createdAt)}
                  </MetaItem>
                  {podcast.duration && (
                    <MetaItem>
                      <MetaIcon>⏱️</MetaIcon>
                      {podcast.duration}
                    </MetaItem>
                  )}
                  {podcast.playCount > 0 && (
                    <MetaItem>
                      <MetaIcon>▶️</MetaIcon>
                      {t("myPodcasts.playCount", { count: podcast.playCount })}
                    </MetaItem>
                  )}
                </CardMeta>
                <CardActions>
                  {podcast.status === "completed" && (
                    <>
                      <ActionButton
                        $variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Play audio
                        }}
                      >
                        ▶️ {t("myPodcasts.play")}
                      </ActionButton>
                      <ActionButton
                        $variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/my-podcasts/${podcast.id}`);
                        }}
                      >
                        ✏️ {t("myPodcasts.edit")}
                      </ActionButton>
                    </>
                  )}
                  {podcast.status === "generating" && (
                    <GeneratingIndicator>
                      <Spinner />
                      {t("myPodcasts.generatingMessage")}
                    </GeneratingIndicator>
                  )}
                </CardActions>
              </PodcastCard>
            ))}
          </PodcastContainer>
        )}
      </Main>
      <Footer />
    </Container>
  );
};

export default MyPodcastsPage;

const Container = styled.div`
  min-height: 100vh;
  background: white;
  padding-top: 4rem;
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`;

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(to right, #4f46e5, #6366f1);
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;

  &:hover {
    background: white;
    border-color: #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchBar = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.625rem 1rem;
  transition: all 0.2s;

  &:focus-within {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const SearchIcon = styled.span`
  font-size: 1rem;
  margin-right: 0.5rem;
  color: #9ca3af;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #111827;
  font-size: 0.9375rem;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.875rem;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  ${(props) =>
    props.$active
      ? `
    background: linear-gradient(to right, #4f46e5, #6366f1);
    color: white;
    border-color: #4f46e5;
  `
      : `
    background: white;
    color: #4b5563;
    border-color: #e5e7eb;
    
    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
      color: #111827;
    }
  `}
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.25rem;
`;

const ViewButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: ${(props) => (props.$active ? "#eef2ff" : "transparent")};
  color: ${(props) => (props.$active ? "#4f46e5" : "#9ca3af")};

  &:hover {
    background: ${(props) => (props.$active ? "#eef2ff" : "#f9fafb")};
    color: ${(props) => (props.$active ? "#4f46e5" : "#4b5563")};
  }
`;

const ResultsInfo = styled.div`
  margin-bottom: 1rem;
`;

const ResultsCount = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const EmptyMessage = styled.p`
  font-size: 0.9375rem;
  color: #9ca3af;
  margin: 0;
  text-align: center;
  padding: 2rem;
`;

const PodcastContainer = styled.div<{ $viewMode: "grid" | "list" }>`
  display: ${(props) => (props.$viewMode === "grid" ? "grid" : "flex")};
  ${(props) =>
    props.$viewMode === "grid"
      ? `
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  `
      : `
    flex-direction: column;
    gap: 1rem;
  `}

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PodcastCard = styled.div<{ $viewMode: "grid" | "list" }>`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  ${(props) =>
    props.$viewMode === "list" &&
    `
    display: flex;
    align-items: center;
    gap: 1.5rem;
  `}

  &:hover {
    border-color: #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CardIcon = styled.span`
  font-size: 1.5rem;
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

const CardPrompt = styled.p`
  font-size: 1rem;
  color: #111827;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const MetaIcon = styled.span`
  font-size: 0.875rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
`;

const ActionButton = styled.button<{ $variant: "primary" | "secondary" }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: linear-gradient(to right, #4f46e5, #6366f1);
    color: white;
    
    &:hover {
      box-shadow: 0 2px 12px rgba(79, 70, 229, 0.4);
    }
  `
      : `
    background: #f9fafb;
    color: #4b5563;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
  `}
`;

const GeneratingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fbbf24;
  font-size: 0.875rem;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-top-color: #fbbf24;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 20px;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
`;

