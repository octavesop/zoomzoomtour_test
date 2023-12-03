import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest.js boilorplate')
    .setDescription('Nest.js boilorplate')
    .setVersion('0.0.1')
    .build();

  const swaggerURI = '/docs';

  SwaggerModule.setup(
    swaggerURI,
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.listen(
    configService.get('PORT'),
    configService.get('HOST'),
    async () => {
      logger.log(
        `Application is successfully running on ${await app.getUrl()}`,
      );
      logger.log(
        `Application Environment is **${configService.get('NODE_ENV')}** Mode`,
      );

      if (configService.get('NODE_ENV') !== 'production') {
        logger.verbose(`You can check ${await app.getUrl()}${swaggerURI}`);
      }
    },
  );
};
bootstrap();
