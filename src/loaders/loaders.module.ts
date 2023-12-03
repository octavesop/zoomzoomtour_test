import { Global, Module } from '@nestjs/common';
import { RedisConnectionProvider } from './redis.loader';

@Global()
@Module({
  providers: [RedisConnectionProvider],
  exports: [RedisConnectionProvider],
})
export class LoadersModule {}
