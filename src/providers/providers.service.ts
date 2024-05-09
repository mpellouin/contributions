import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GithubResponse, NormalizedContributions } from './providers.dto';

@Injectable()
export class ProvidersService {
  async getContributionsFromGithub(name: string): Promise<GithubResponse> {

    const response = await fetch(`https://api.github.com/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
            query {
                user(login: "${name}") {
                  login
                  contributionsCollection {
                    contributionCalendar {
                      weeks {
                        contributionDays {
                          contributionCount
                          date
                        }
                      }
                    }
                  }
                }
              }
            `,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      if (data.errors[0].type === 'NOT_FOUND') {
        throw new NotFoundException('User not found');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return data.data.user;
  }

  async getContributionsFromGitlab(name: string): Promise<NormalizedContributions> {
    try {
    const response = await fetch(
      `https://gitlab.com/users/${name}/calendar.json`,
    );

    const data = await response.json();
    return data;
  } catch (error) {
      throw new NotFoundException('User not found');
  } 
  }
}
