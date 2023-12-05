import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AccessTokenConfig } from '../configurations/accessToken.config';
import { AccessTokenCookieConfig } from '../configurations/accessTokenCookie.config';
import { RefreshTokenConfig } from '../configurations/refreshToken.config';
import { RefreshTokenCookieConfig } from '../configurations/refreshTokenCookie.config';
import { SignInRequest } from '../dto/signInRequest.dto';
import { SignUpRequest } from '../dto/signUpRequest.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserService } from '../services/user.service';

@ApiTags('사용자')
@Controller('/user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

    private readonly accessTokenConfig: AccessTokenConfig,
    private readonly accessTokenCookieConfig: AccessTokenCookieConfig,
    private readonly refreshTokenConfig: RefreshTokenConfig,
    private readonly refreshTokenCookieConfig: RefreshTokenCookieConfig,
  ) {}
  @ApiOperation({ description: '회원가입' })
  @ApiCreatedResponse({ type: User })
  @HttpCode(HttpStatus.CREATED)
  @Post('/signUp')
  async signUp(@Body() request: SignUpRequest): Promise<User> {
    return await this.userService.signUp(request);
  }

  @ApiOperation({ description: '로그인' })
  @Post('/signIn')
  async signIn(
    @Body() request: SignInRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const userInfo = await this.userService.signIn(request);
    const accessToken = this.jwtService.sign(
      {
        userUid: userInfo.userUid,
        userId: userInfo.userId,
      },
      this.accessTokenConfig.make(),
    );
    const refreshToken = this.jwtService.sign(
      {
        userUid: userInfo.userUid,
      },
      this.refreshTokenConfig.make(),
    );
    res.cookie(
      this.configService.get<string>('ACCESS_TOKEN_NAME'),
      accessToken,
      this.accessTokenCookieConfig.make(),
    );
    res.cookie(
      this.configService.get<string>('REFRESH_TOKEN_NAME'),
      refreshToken,
      this.refreshTokenCookieConfig.make(),
    );
    return userInfo;
  }

  @ApiOperation({ description: '로그아웃' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post('/signOut')
  async signOut(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie(this.configService.get<string>('ACCESS_TOKEN_NAME'));
    res.clearCookie(this.configService.get<string>('REFRESH_TOKEN_NAME'));
    return;
  }
}
