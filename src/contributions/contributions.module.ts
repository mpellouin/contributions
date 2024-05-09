import { Module } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { ContributionsController } from './contributions.controller';
import { ProvidersModule } from 'src/providers/providers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProvidersModule, ConfigModule.forRoot()],
  controllers: [ContributionsController],
  providers: [ContributionsService],
  exports: [ContributionsService],
})
export class ContributionsModule {}
