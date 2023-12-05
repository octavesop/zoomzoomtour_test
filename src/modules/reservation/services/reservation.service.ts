import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { CannotCancelReservationException } from 'src/exceptions/cannotCancelReservation.exception';
import { NotFoundReservationException } from 'src/exceptions/notFoundReservation.exception';
import { Tour } from 'src/modules/tour/entities/tour.entity';
import { TourService } from 'src/modules/tour/services/tour.service';
import { Payload } from 'src/modules/user/dto/payload.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { Between, Equal, In, Repository } from 'typeorm';
import { ReservationStatus } from '../consts/reservationStatus.enum';
import { ApproveReservationRequest } from '../dto/approveReservationRequest.dto';
import { ReservationRequest } from '../dto/reservationRequest.dto';
import { Reservation } from '../entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    private readonly tourService: TourService,
  ) {}
  private readonly logger = new Logger(ReservationService.name);

  async fetchMyReservationList(userInfo: Payload): Promise<Reservation[]> {
    try {
      return await this.reservationRepository.find({
        where: {
          user: Equal(userInfo.userUid),
        },
        relations: ['tour'],
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchMySellerReservationList(
    onlyWait: boolean,
    userInfo: Payload,
  ): Promise<Reservation[]> {
    try {
      const tourList = await this.tourService.fetchTourBySellerInfo(userInfo);
      if (onlyWait) {
        return await this.reservationRepository.find({
          where: {
            tour: In(tourList.map((v) => v.tourUid)),
            status: Equal(ReservationStatus.WAIT),
          },
          relations: ['tour'],
        });
      }
      return await this.reservationRepository.find({
        where: {
          tour: In(tourList.map((v) => v.tourUid)),
        },
        relations: ['tour'],
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addReservation(
    request: ReservationRequest,
    userInfo: Payload,
  ): Promise<{ code: string }> {
    try {
      const autoApprovedCount = await this.reservationRepository.count({
        where: {
          // tour: Equal(request.tourUid),
          createdAt: Between(
            startOfDay(new Date().getTime()),
            endOfDay(new Date()),
          ),
        },
      });
      const reservationStatus =
        autoApprovedCount < 5
          ? ReservationStatus.APPROVE
          : ReservationStatus.WAIT;

      const result = await this.reservationRepository.save({
        ...request,
        status: reservationStatus,
        tour: new Tour(request.tourUid),
        user: new User(userInfo.userUid),
      });
      return { code: result.uuid };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async changeReservationStatus(
    request: ApproveReservationRequest,
    userInfo: Payload,
    status: ReservationStatus,
  ): Promise<void> {
    try {
      const sellerTourList = (
        await this.tourService.fetchTourBySellerInfo(userInfo)
      ).map((v) => v.tourUid);
      const foundReservationList = await this.reservationRepository.find({
        where: {
          tour: In(sellerTourList),
          reservationUid: In(request.reservationUid),
        },
      });
      await this.reservationRepository.update(
        foundReservationList.map((v) => v.reservationUid),
        {
          status: status,
        },
      );
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteReservation(
    reservationUid: string,
    userInfo: Payload,
  ): Promise<void> {
    try {
      const foundReservation = await this.reservationRepository.findOne({
        where: {
          uuid: Equal(reservationUid),
          user: Equal(userInfo.userUid),
        },
      });
      if (!foundReservation) {
        throw new NotFoundReservationException();
      }
      if (new Date(foundReservation.date) > addDays(new Date(), 3)) {
        await this.reservationRepository.delete(
          foundReservation.reservationUid,
        );
      } else {
        throw new CannotCancelReservationException();
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
