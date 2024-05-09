import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvidersModule } from './providers/providers.module';
import { ConfigModule } from '@nestjs/config';
import { ContributionsModule } from './contributions/contributions.module';

@Module({
  imports: [ProvidersModule, ContributionsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
