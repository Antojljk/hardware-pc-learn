export interface AdminStats {
  content: {
    lessons: number;
    questions: number;
    exams: number;
    glossary: number;
    scenarios: number;
    components: number;
  };
  users: {
    total: number;
    new24h: number;
    new7d: number;
    new30d: number;
    active24h: number;
    planDistribution: Array<{ plan: string; count: number }>;
  };
  performance: {
    avgExamScore: number;
    avgQuizScore: number;
    totalBadges: number;
    totalReviewCards: number;
    totalReviews: number;
  };
  traffic: {
    pv24h: number;
    uv24h: number;
    pv7d: number;
    uv7d: number;
    pv30d: number;
    uv30d: number;
    topPages: Array<{ url: string; count: number }>;
  };
  aiSupport: {
    totalMessages: number;
    recentInterviews: number;
    recentDiagnostics: number;
  };
}
