import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenConfig } from './configurations/accessToken.config';
import { AccessTokenCookieConfig } from './configurations/accessTokenCookie.config';
import { RefreshTokenConfig } from './configurations/refreshToken.config';
import { RefreshTokenCookieConfig } from './configurations/refreshTokenCookie.config';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    AccessTokenConfig,
    AccessTokenCookieConfig,
    RefreshTokenConfig,
    RefreshTokenCookieConfig,
    JwtService,
    JwtStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}
