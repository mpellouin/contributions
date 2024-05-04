import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ProvidersService } from './providers/providers.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly githubService: ProvidersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
