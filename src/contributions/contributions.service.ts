import { Injectable } from '@nestjs/common';
import { GithubResponse, NormalizedContributions } from 'src/providers/providers.dto';

@Injectable()
export class ContributionsService {
  normalizeGithubContributions(contributions: GithubResponse): NormalizedContributions {
    const weeks = contributions.contributionsCollection.contributionCalendar.weeks;
    const data = {};
    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        data[day.date] = day.contributionCount;
      });
    });

    return data;
  }

  computeTotalContributions(contributionsA: NormalizedContributions, contributionsB: NormalizedContributions): NormalizedContributions {
    const data = { ...contributionsA };

    for (const date in contributionsB) {
      if (data[date]) {
        data[date] += contributionsB[date];
      } else {
        data[date] = contributionsB[date];
      }
    }

    return data;
  }
}
