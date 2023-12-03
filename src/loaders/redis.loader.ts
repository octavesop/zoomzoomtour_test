import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export const REDIS_CONNECTION_PROVIDER_NAME = 'RedisConnectionProvider';
export const RedisConnectionProvider = {
  provide: REDIS_CONNECTION_PROVIDER_NAME,
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger(REDIS_CONNECTION_PROVIDER_NAME);
    const port = configService.get<number>('REDIS_PORT');
    const host = configService.get<string>('REDIS_HOST');
    const pw = configService.get<string>('REDIS_PASSWORD');
    const redis = new Redis(`redis://:${pw}@${host}:${port}/`);

    redis.on('connect', () => {
      logger.log('The Redis Connection is Successful.');
    });

    redis.on('error', (error) => {
      logger.error(`Redis got Error :: ${error.message}`);
    });

    redis.on('close', () => {
      logger.warn('Redis Connection Closed.');
    });

    return redis;
  },
  inject: [ConfigService],
};
