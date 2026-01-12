export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  category: string;
}

export interface BriefResponse {
  briefDate: string;
  headline: string;
  articles: NewsItem[];
}
