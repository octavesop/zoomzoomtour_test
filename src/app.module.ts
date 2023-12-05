import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { LoadersModule } from './loaders/loaders.module';
import { SellerModule } from './modules/seller/seller.module';
import { JwtStrategy } from './modules/user/strategies/jwt.strategy';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize:
          configService.get('NODE_ENV') === 'development' ? true : false,
        logging: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({}),

    LoadersModule,
    UserModule,
    SellerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
