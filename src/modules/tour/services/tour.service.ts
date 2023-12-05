import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundTourException } from 'src/exceptions/notFoundTour.exception';
import { SellerService } from 'src/modules/seller/services/seller.service';
import { Payload } from 'src/modules/user/dto/payload.dto';
import { Equal, Repository } from 'typeorm';
import { TourOffRequest } from '../dto/tourOffRequest.dto';
import { TourRequest } from '../dto/tourRequest.dto';
import { Tour } from '../entities/tour.entity';

@Injectable()
export class TourService {
  constructor(
    @Inject('RedisConnectionProvider')
    private readonly RedisConnectionProvider,
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    private readonly sellerService: SellerService,
  ) {}
  private readonly logger = new Logger(TourService.name);

  async fetchTourList(): Promise<Tour[]> {
    try {
      // TODO
      // pagination 및 정렬
      return await this.tourRepository.find();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchTourById(tourUid: number): Promise<Tour> {
    try {
      const foundTour = await this.tourRepository.findOne({
        where: {
          tourUid: tourUid,
        },
      });
      if (!foundTour) {
        throw new NotFoundTourException();
      }
      return foundTour;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundTourException) {
        throw error;
      }
    }
  }

  async fetchTourCalendar(
    tourUid: number,
    year: number,
    month: number,
  ): Promise<any> {
    try {
      tourUid;
      year;
      month;
      // TODO
      // 여기에서 휴일 날짜를 조회
      // 캐시는 조회 시점에 하는 걸로 합시다.
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchTourBySellerInfo(userInfo: Payload): Promise<Tour[]> {
    try {
      const sellerInfo = await this.sellerService.fetchMySellerInfo(userInfo);
      return await this.tourRepository.find({
        where: {
          seller: Equal(sellerInfo.sellerUid),
        },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addTour(request: TourRequest, userInfo: Payload): Promise<any> {
    try {
      const sellerInfo = await this.sellerService.fetchMySellerInfo(userInfo);

      const result = await this.tourRepository.save({
        ...request,
        tourUid: 0,
        seller: sellerInfo,
      });
      console.log(result.tourUid);
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateTour(
    tourUid: number,
    request: TourRequest,
    userInfo: Payload,
  ): Promise<void> {
    try {
      const sellerInfo = await this.sellerService.fetchMySellerInfo(userInfo);
      const foundTour = await this.tourRepository.findOne({
        where: {
          tourUid: Equal(tourUid),
          seller: Equal(sellerInfo.sellerUid),
        },
      });
      if (!foundTour) {
        throw new NotFoundTourException();
      }
      await this.tourRepository.update(foundTour.tourUid, request);
      return;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundTourException) {
        throw error;
      }
    }
  }

  async updateTourOff(
    request: TourOffRequest,
    userInfo: Payload,
  ): Promise<Tour> {
    request;
    userInfo;
    throw new Error('Method not implemented.');
  }

  async deleteTour(tourUid: number, userInfo: Payload): Promise<void> {
    try {
      const sellerInfo = await this.sellerService.fetchMySellerInfo(userInfo);
      const foundTour = await this.tourRepository.findOne({
        where: {
          tourUid: Equal(tourUid),
          seller: Equal(sellerInfo.sellerUid),
        },
      });
      if (!foundTour) {
        throw new NotFoundTourException();
      }

      // 연결된 데이터를 위해 삭제하지 않고 deletedAt만 변경.
      await this.tourRepository.update(foundTour.tourUid, {
        deletedAt: new Date(),
      });

      return;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundTourException) {
        throw error;
      }
    }
  }
}
