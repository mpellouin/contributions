import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { parse } from 'date-fns';
import { GithubResponse, NormalizedContributions } from 'src/providers/providers.dto';
import * as plotly from 'plotly';

@Injectable()
export class ContributionsService {
  plotly: any = plotly(process.env.PLOTLY_USER, process.env.PLOTLY_API_KEY);
  constructor() {
  }
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

  async createHeatmap(data: NormalizedContributions, ids: string): Promise<string> {
    let returnURL = '';
    const contributionsPerDay = this.computeHeatmapData(data);
    const totalContributions = Object.values(data).reduce((acc, val) => acc + val, 0);
    const heatmapData = [
      {
        z: contributionsPerDay,
        y: ['Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon', 'Sun'],
        x: ['W-52', 'W-51', 'W-50', 'W-49', 'W-48', 'W-47', 'W-46', 'W-45', 'W-44', 'W-43', 'W-42', 'W-41', 'W-40', 'W-39', 'W-38', 'W-37', 'W-36', 'W-35', 'W-34', 'W-33', 'W-32', 'W-31', 'W-30', 'W-29', 'W-28', 'W-27', 'W-26', 'W-25', 'W-24', 'W-23', 'W-22', 'W-21', 'W-20', 'W-19', 'W-18', 'W-17', 'W-16', 'W-15', 'W-14', 'W-13', 'W-12', 'W-11', 'W-10', 'W-9', 'W-8', 'W-7', 'W-6', 'W-5', 'W-4', 'W-3', 'W-2', 'W-1', 'W0'],
        type: 'heatmap',
        name: `${ids} total contributions: ${totalContributions}`,
        colorscale: 'Greens',
        reversescale: true,
      }
    ]
    const layout = {
      title: `${ids} total contributions: ${totalContributions}`,
      xaxis: {
        title: 'Weeks',
      },
      yaxis: {
        title: 'Days',
      }
    }
    const graphOptions = {
      fileopt: 'overwrite',
      filename: ids,
      layout
    };

    await new Promise((resolve, reject) => {
      this.plotly.plot(heatmapData, graphOptions, function (err, msg) {
          if (err) {
              reject(err);
          } else {
              resolve(msg.url + '.png');
          }
      });
    }).then((url: string) => {
      returnURL = url;
    }).catch((error) => {
      console.error(error);
      throw new InternalServerErrorException("Error while creating heatmap");
    });

    return returnURL;
  }

  computeHeatmapData(data: NormalizedContributions): (number | null)[][] {
    const contributionsPerDay = [[], [], [], [], [], [], []];
    Object.keys(data).forEach((date) => {
      const testDate = parse(date, 'yyyy-MM-dd', new Date());
      const day = testDate.getDay();
      if (data[date] === 0) contributionsPerDay[day].push(null);
      else
      contributionsPerDay[day].push(data[date]);
    });

    // Normalization of data so that the heatmap is correctly displayed
    const firstContributionDay = parse(Object.keys(data)[0], 'yyyy-MM-dd', new Date()).getDay();
    const lastContributionDay = parse(Object.keys(data)[Object.keys(data).length - 1], 'yyyy-MM-dd', new Date()).getDay();
    
    for (let i = 0; i < firstContributionDay; i++) {
      contributionsPerDay[i].unshift(null);
    }

    for (let i = lastContributionDay + 1; i < 7; i++) {
      contributionsPerDay[i].push(null);
    }

    return contributionsPerDay.reverse();
  }
}
