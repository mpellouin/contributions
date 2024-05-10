import { Test, TestingModule } from '@nestjs/testing';
import { ContributionsService } from './contributions.service';

describe('ContributionsService', () => {
  let service: ContributionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContributionsService],
    }).compile();

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2022-01-01'));

    service = module.get<ContributionsService>(ContributionsService);
  });

  describe('normalizeGithubContributions', () => {
    it('should normalize Github contributions', () => {
      const contributions = {
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

      const result = service.normalizeGithubContributions(contributions);
      expect(result).toEqual({
        '2022-01-01': 5,
        '2022-01-02': 3,
      });
    });
  });

  describe('computeTotalContributions', () => {
    it('should compute total contributions', () => {
      const contributionsA = {
        '2022-01-01': 5,
        '2022-01-02': 3,
      };
      const contributionsB = {
        '2022-01-01': 2,
        '2022-01-03': 4,
      };

      const result = service.computeTotalContributions(contributionsA, contributionsB);

      expect(result).toEqual({
        '2022-01-01': 7,
        '2022-01-02': 3,
        '2022-01-03': 4,
      });
    });
  });

  describe('generateDateLegend', () => {
    it('should generate date legend', () => {
      // Execute
      const result = service.generateDateLegend();

      expect(result).toEqual([
        'Jan 02',
        'Jan 09',
        'Jan 16',
        'Jan 23',
        'Jan 30',
        'Feb 06',
        'Feb 13',
        'Feb 20',
        'Feb 27',
        'Mar 06',
        'Mar 13',
        'Mar 20',
        'Mar 27',
        'Apr 03',
        'Apr 10',
        'Apr 17',
        'Apr 24',
        'May 01',
        'May 08',
        'May 15',
        'May 22',
        'May 29',
        'Jun 05',
        'Jun 12',
        'Jun 19',
        'Jun 26',
        'Jul 03',
        'Jul 10',
        'Jul 17',
        'Jul 24',
        'Jul 31',
        'Aug 07',
        'Aug 14',
        'Aug 21',
        'Aug 28',
        'Sep 04',
        'Sep 11',
        'Sep 18',
        'Sep 25',
        'Oct 02',
        'Oct 09',
        'Oct 16',
        'Oct 23',
        'Oct 30',
        'Nov 06',
        'Nov 13',
        'Nov 20',
        'Nov 27',
        'Dec 04',
        'Dec 11',
        'Dec 18',
        'Dec 25',
        'Jan 01',
      ]);
    });
  });

  // Add more test cases for other methods...

});