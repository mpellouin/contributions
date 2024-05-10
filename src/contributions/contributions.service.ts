import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { addWeeks, endOfWeek, format, parse } from 'date-fns';
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

  async createHeatmap(data: NormalizedContributions, githubId: string, gitlabId: string): Promise<string> {
    let returnURL = '';
    const contributionsPerDay = this.computeHeatmapData(data);
    const totalContributions = Object.values(data).reduce((acc, val) => acc + val, 0);
    const heatmapData = [
      {
        z: contributionsPerDay,
        y: ['Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon', 'Sun'],
        x: this.generateDateLegend(),
        type: 'heatmap',
        colorscale: 'Greens',
        xgap: 2,
        ygap: 2,
      }
    ]
    const layout = {
      title: {
        text: `Github user ${githubId} and Gitlab user ${gitlabId} total contributions: ${totalContributions}`,
        font: {
          color: '#EEEEEE'
        }
      },
      yaxis: {
        tickvals: [0, 2, 4, 6],
        color: '#EEEEEE'
      },
      xaxis: {
        dtick: 2,
        color: '#EEEEEE'

      },
      width: 1000,
      height: 300,
      xgap: 1,
      paper_bgcolor: '#31363F',
      plot_bgcolor: '#222831',
      font: {
        color: '#EEEEEE'
      }
    }
    const graphOptions = {
      fileopt: 'overwrite',
      filename: githubId + '_' + gitlabId,
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

  generateDateLegend(): string[] {
    const dateLegend = [];
    const currentDate = new Date();
    for (let i = 0; i <= 52; i++) {
      const d = addWeeks(endOfWeek(currentDate, { weekStartsOn: 0 }), -i);
      dateLegend.push(format(d, 'MMM dd'));
    }

    return dateLegend.reverse();

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
