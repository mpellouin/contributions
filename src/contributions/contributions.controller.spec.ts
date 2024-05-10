import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ContributionsController } from './contributions.controller';
import { ProvidersService } from '../providers/providers.service';
import { ContributionsService } from './contributions.service';

describe('ContributionsController', () => {
  let controller: ContributionsController;
  let providersService: ProvidersService;
  let contributionsService: ContributionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContributionsController],
      providers: [ProvidersService, ContributionsService],
    }).compile();

    controller = module.get<ContributionsController>(ContributionsController);
    providersService = module.get<ProvidersService>(ProvidersService);
    contributionsService =
      module.get<ContributionsService>(ContributionsService);
  });

  describe('getContribution', () => {
    it('should throw BadRequestException if github_id or gitlab_id is missing', async () => {
      const github_id = '';
      const gitlab_id = '';

      await expect(
        controller.getContribution(github_id, gitlab_id),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should return total contributions', async () => {
      const github_id = 'github_id';
      const gitlab_id = 'gitlab_id';
      const githubContributions = {
        login: 'test',
        contributionsCollection: {
          contributionCalendar: {
            weeks: [
              {
                contributionDays: [
                  { date: '2022-01-01', contributionCount: 5 },
                  { date: '2022-01-02', contributionCount: 3 },
                ],
              },
            ],
          },
        },
      };
      const gitlabContributions = {
        '2022-01-01': 2,
        '2022-01-03': 4,
      };
      const normalizedGithubContributions = {
        '2022-01-01': 5,
        '2022-01-02': 3,
      };
      const totalContributions = {
        '2022-01-01': 7,
        '2022-01-02': 3,
        '2022-01-03': 4,
      };

      jest
        .spyOn(providersService, 'getContributionsFromGithub')
        .mockResolvedValue(githubContributions);
      jest
        .spyOn(providersService, 'getContributionsFromGitlab')
        .mockResolvedValue(gitlabContributions);
      jest
        .spyOn(contributionsService, 'normalizeGithubContributions')
        .mockReturnValue(normalizedGithubContributions);
      jest
        .spyOn(contributionsService, 'computeTotalContributions')
        .mockReturnValue(totalContributions);

      const result = await controller.getContribution(github_id, gitlab_id);

      expect(result).toEqual(totalContributions);
      expect(providersService.getContributionsFromGithub).toHaveBeenCalledWith(
        github_id,
      );
      expect(providersService.getContributionsFromGitlab).toHaveBeenCalledWith(
        gitlab_id,
      );
      expect(
        contributionsService.normalizeGithubContributions,
      ).toHaveBeenCalledWith(githubContributions);
      expect(
        contributionsService.computeTotalContributions,
      ).toHaveBeenCalledWith(
        normalizedGithubContributions,
        gitlabContributions,
      );
    });
  });

  describe('getHeatmap', () => {
    it('should throw BadRequestException if github_id or gitlab_id is missing', async () => {
      const github_id = '';
      const gitlab_id = '';

      await expect(
        controller.getHeatmap(github_id, gitlab_id),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should return heatmap', async () => {
      const github_id = 'github_id';
      const gitlab_id = 'gitlab_id';
      const githubContributions = {
        login: 'test',
        contributionsCollection: {
          contributionCalendar: {
            weeks: [
              {
                contributionDays: [
                  { date: '2022-01-01', contributionCount: 5 },
                  { date: '2022-01-02', contributionCount: 3 },
                ],
              },
            ],
          },
        },
      };
      const gitlabContributions = {
        '2022-01-01': 2,
        '2022-01-03': 4,
      };
      const normalizedGithubContributions = {
        '2022-01-01': 5,
        '2022-01-02': 3,
      };
      const totalContributions = {
        '2022-01-01': 7,
        '2022-01-02': 3,
        '2022-01-03': 4,
      };
      const heatmap = 'heatmap';

      jest
        .spyOn(providersService, 'getContributionsFromGithub')
        .mockResolvedValue(githubContributions);
      jest
        .spyOn(providersService, 'getContributionsFromGitlab')
        .mockResolvedValue(gitlabContributions);
      jest
        .spyOn(contributionsService, 'normalizeGithubContributions')
        .mockReturnValue(normalizedGithubContributions);
      jest
        .spyOn(contributionsService, 'computeTotalContributions')
        .mockReturnValue(totalContributions);
      jest
        .spyOn(contributionsService, 'createHeatmap')
        .mockReturnValue(Promise.resolve(heatmap));

      const result = await controller.getHeatmap(github_id, gitlab_id);

      expect(result).toEqual(heatmap);
      expect(providersService.getContributionsFromGithub).toHaveBeenCalledWith(
        github_id,
      );
      expect(providersService.getContributionsFromGitlab).toHaveBeenCalledWith(
        gitlab_id,
      );
      expect(
        contributionsService.normalizeGithubContributions,
      ).toHaveBeenCalledWith(githubContributions);
      expect(
        contributionsService.computeTotalContributions,
      ).toHaveBeenCalledWith(
        normalizedGithubContributions,
        gitlabContributions,
      );
      expect(contributionsService.createHeatmap).toHaveBeenCalledWith(
        totalContributions,
        github_id,
        gitlab_id,
      );
    });

    it('should throw InternalServerErrorException if an error occurs while creating heatmap', async () => {
      const github_id = 'github_id';
      const gitlab_id = 'gitlab_id';
      const githubContributions = {
        login: 'test',
        contributionsCollection: {
          contributionCalendar: {
            weeks: [
              {
                contributionDays: [
                  { date: '2022-01-01', contributionCount: 5 },
                  { date: '2022-01-02', contributionCount: 3 },
                ],
              },
            ],
          },
        },
      };
      const gitlabContributions = {
        '2022-01-01': 2,
        '2022-01-03': 4,
      };
      jest
        .spyOn(providersService, 'getContributionsFromGithub')
        .mockResolvedValue(githubContributions);
      jest
        .spyOn(providersService, 'getContributionsFromGitlab')
        .mockResolvedValue(gitlabContributions);

      await expect(
        // undefined plotly user generates error
        controller.getHeatmap(github_id, gitlab_id),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
