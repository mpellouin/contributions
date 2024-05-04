import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
