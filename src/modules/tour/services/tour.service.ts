import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  addDays,
  addMonths,
  format,
  getDay,
  isBefore,
  startOfMonth,
} from 'date-fns';
import { NotFoundTourException } from 'src/exceptions/notFoundTour.exception';
import { SellerService } from 'src/modules/seller/services/seller.service';
import { Payload } from 'src/modules/user/dto/payload.dto';
import { Equal, Repository } from 'typeorm';
import { TourOffRequest } from '../dto/tourOffRequest.dto';
import { TourRequest } from '../dto/tourRequest.dto';
import { IrregularOffDay } from '../entities/irregularOffDay.entity';
import { RegularOffDay } from '../entities/regularOffDay.entity';
import { Tour } from '../entities/tour.entity';

@Injectable()
export class TourService {
  constructor(
    @Inject('RedisConnectionProvider')
    private readonly RedisConnectionProvider,
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @InjectRepository(RegularOffDay)
    private readonly regularOffDayRepository: Repository<RegularOffDay>,
    @InjectRepository(IrregularOffDay)
    private readonly irregularOffDayRepository: Repository<IrregularOffDay>,

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

  #fetchRegularOffDayAsNumber(request: RegularOffDay) {
    delete request.regularOffDayUid;
    delete request.createdAt;
    delete request.updatedAt;
    delete request.tour;
    return Object.entries(request)
      .map(([key, value], index) => {
        if (value) {
          return index;
        }
      })
      .filter((v) => !isNaN(v));
  }

  async #fetchAvailableTourDate(tourUid: number, year: number, month: number) {
    const irregularInfo = await this.irregularOffDayRepository.find({
      where: {
        tour: Equal(tourUid),
      },
    });
    const regularInfo = await this.regularOffDayRepository.findOne({
      where: {
        tour: Equal(tourUid),
      },
    });

    const startOfCurrent = startOfMonth(new Date(year, month - 1, 1));
    const startOfNext = addMonths(startOfCurrent, 1);

    let days = [];

    for (let i = startOfCurrent; isBefore(i, startOfNext); i = addDays(i, 1)) {
      days.push({ number: getDay(i), day: format(i, 'yyyy-MM-dd') });
    }

    // 비정규적 오프데이를 제거
    days = days.filter(
      (v) =>
        !irregularInfo
          .map((irregularDate) => irregularDate.date)
          .includes(v.day),
    );

    // 정규적 오프데이를 제거
    days = days.filter(
      (v) => !this.#fetchRegularOffDayAsNumber(regularInfo).includes(v.number),
    );
    return days;
  }

  async fetchTourCalendar(
    tourUid: number,
    year: number,
    month: number,
  ): Promise<{ number: number; day: string }[]> {
    try {
      const cachedKey = `TOUR:${tourUid}:${year}:${month}`;
      const cachedValue = await this.RedisConnectionProvider.get(cachedKey);
      if (cachedValue) {
        return cachedValue;
      }
      const result = await this.#fetchAvailableTourDate(tourUid, year, month);
      await this.RedisConnectionProvider.set(
        cachedKey,
        JSON.stringify(result),
        'EX',
        60 * 60 * 24 * 7, // 7일
      );

      return result;
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

      await this.tourRepository.save({
        ...request,
        tourUid: 0,
        seller: sellerInfo,
      });
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
    tourUid: number,
    request: TourOffRequest,
    userInfo: Payload,
  ): Promise<void> {
    try {
      const sellerTourList = await this.fetchTourBySellerInfo(userInfo);
      if (!sellerTourList.map((v) => v.tourUid).includes(tourUid)) {
        throw new NotFoundTourException();
      }

      const regularOffDay = await this.regularOffDayRepository.findOne({
        where: {
          tour: Equal(tourUid),
        },
      });
      if (regularOffDay) {
        await this.regularOffDayRepository.update(
          regularOffDay.regularOffDayUid,
          request.regularDay,
        );
      } else {
        await this.regularOffDayRepository.save({
          ...request.regularDay,
          tour: new Tour(tourUid),
        });
      }
      const irregularOffDay = await this.irregularOffDayRepository.find({
        where: {
          tour: Equal(tourUid),
        },
      });

      if (irregularOffDay.length > 0) {
        await this.irregularOffDayRepository.delete(
          irregularOffDay.map((v) => v.irregularOffDayUid),
        );
      }

      await this.irregularOffDayRepository.save(
        request.irregularDayList.map((v) => {
          return {
            date: v,
            tour: new Tour(tourUid),
          };
        }),
      );
      const keys = await this.RedisConnectionProvider.keys(`TOUR:${tourUid}:*`);
      await this.RedisConnectionProvider.del(keys);
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
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
