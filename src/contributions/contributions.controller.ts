import { BadRequestException, Controller, Get, InternalServerErrorException, Query } from '@nestjs/common';
import { ProvidersService } from '../providers/providers.service';
import { ContributionsService } from './contributions.service';
import { NormalizedContributions } from 'src/providers/providers.dto';

@Controller('contributions')
export class ContributionsController {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly contributionsService: ContributionsService,
  ) {}

  @Get()
  async getContribution(@Query('github_id') github_id: string, @Query('gitlab_id') gitlab_id: string): Promise<NormalizedContributions> {
    if (!github_id || !gitlab_id) {
      throw new BadRequestException("Missing github_id or gitlab_id query parameter")
    }
    
    const githhubContributions = await this.providersService.getContributionsFromGithub(github_id);
    const gitlabContributions = await this.providersService.getContributionsFromGitlab(gitlab_id);

    const normalizedGithubContributions = this.contributionsService.normalizeGithubContributions(githhubContributions);

    const totalContributions = this.contributionsService.computeTotalContributions(
      normalizedGithubContributions,
      gitlabContributions,
    );

    return totalContributions;
  }

  @Get('/heatmap')
  async getHeatmap(@Query('github_id') github_id: string, @Query('gitlab_id') gitlab_id: string): Promise<string> {
    if (!github_id || !gitlab_id) {
      throw new BadRequestException("Missing github_id or gitlab_id query parameter")
    }
    
    const githhubContributions = await this.providersService.getContributionsFromGithub(github_id);
    const gitlabContributions = await this.providersService.getContributionsFromGitlab(gitlab_id);

    const normalizedGithubContributions = this.contributionsService.normalizeGithubContributions(githhubContributions);

    const totalContributions = this.contributionsService.computeTotalContributions(
      normalizedGithubContributions,
      gitlabContributions,
    );

    try {
    return this.contributionsService.createHeatmap(totalContributions, `${github_id}-${gitlab_id}`);
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException("Error while creating heatmap");
    }
  }
}
