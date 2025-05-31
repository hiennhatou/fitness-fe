export interface IRecommendSessionTrainer {
  session: {
    id: number;
    name: string;
    description: string;
    coverImage: string | null;
  };
  trainer: {
    username: string;
    firstName: string;
    avatar: string | null;
  };
  recommendSessionId: number;
}
