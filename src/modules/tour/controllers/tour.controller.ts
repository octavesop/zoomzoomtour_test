import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/decoraters/userPayload.decorator';
import { Payload } from 'src/modules/user/dto/payload.dto';
import { JwtAuthGuard } from 'src/modules/user/guards/jwt.guard';
import { TourOffRequest } from '../dto/tourOffRequest.dto';
import { TourRequest } from '../dto/tourRequest.dto';
import { Tour } from '../entities/tour.entity';
import { TourService } from '../services/tour.service';

@ApiTags('투어')
@Controller('/tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}
  @ApiOperation({ description: '전체 투어 정보를 가져옵니다.' })
  @Get('/')
  async fetchTourList(): Promise<Tour[]> {
    return await this.tourService.fetchTourList();
  }

  @ApiOperation({ description: '특정 투어 세부 정보를 가져옵니다.' })
  @Get('/:tourUid')
  async fetchTourById(@Param('tourUid') tourUid: number): Promise<Tour> {
    return await this.tourService.fetchTourById(tourUid);
  }

  @ApiOperation({
    description: '특정 투어의 예약 가능한 일정을 조회합니다.',
    deprecated: true,
  })
  @Get('/:tourUid/calendar')
  // TODO any
  async fetchTourCalendar(
    @Param('tourUid') tourUid: number,
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<any> {
    return await this.tourService.fetchTourCalendar(tourUid, year, month);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '내가 운영중인 투어 프로그램을 조회합니다.' })
  @Get('/seller/me')
  async fetchTourBySellerInfo(
    @UserPayload() userInfo: Payload,
  ): Promise<Tour[]> {
    return await this.tourService.fetchTourBySellerInfo(userInfo);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '내 투어 프로그램을 하나 추가합니다.' })
  @Post('/seller')
  async addTour(
    @Body() request: TourRequest,
    @UserPayload() userInfo: Payload,
  ): Promise<Tour> {
    return await this.tourService.addTour(request, userInfo);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '내 투어 프로그램을 수정합니다.' })
  @Put('/seller/:tourUid')
  async updateTour(
    @Param('tourUid') tourUid: number,
    @Body() request: TourRequest,
    @UserPayload() userInfo: Payload,
  ): Promise<void> {
    await this.tourService.updateTour(tourUid, request, userInfo);
    return;
  }

  // TODO
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: '내 투어 프로그램의 휴일을 수정합니다.',
    deprecated: true,
  })
  @Patch('/seller/:tourUid/calendar')
  async updateTourOff(
    @Body() request: TourOffRequest,
    @UserPayload() userInfo: Payload,
  ): Promise<Tour> {
    return await this.tourService.updateTourOff(request, userInfo);
  }

  @ApiOperation({ description: '내 투어 프로그램을 삭제합니다.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/seller/:tourUid')
  async deleteTour(
    @Param('tourUid') tourUid: number,
    @UserPayload() userInfo: Payload,
  ): Promise<void> {
    await this.tourService.deleteTour(tourUid, userInfo);
    return;
  }
}
