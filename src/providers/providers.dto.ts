export type GithubResponse = {
  login: string;
  contributionsCollection: {
    contributionCalendar: {
      weeks: {
        contributionDays: {
          contributionCount: number;
          date: string;
        }[];
      }[];
    };
  };
};

export type NormalizedContributions = {
    [date: string]: number;
};