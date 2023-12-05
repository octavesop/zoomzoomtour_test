import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundSellerException } from 'src/exceptions/notFoundSeller.exception';
import { Payload } from 'src/modules/user/dto/payload.dto';
import { Equal, Repository } from 'typeorm';
import { SellerRequest } from '../dto/sellerRequest.dto';
import { Seller } from '../entities/seller.entity';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}
  private readonly logger = new Logger(Seller.name);

  async registerAsSeller(request: SellerRequest, userInfo: Payload) {
    try {
      await this.sellerRepository.save({
        ...request,
        userUid: userInfo.userUid,
        isActivate: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchMySellerInfo(request: Payload) {
    try {
      const foundSeller = await this.sellerRepository.findOne({
        where: {
          user: Equal(request.userUid),
        },
        relations: ['user'],
      });
      if (!foundSeller) {
        throw new NotFoundSellerException();
      }
      return foundSeller;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundSellerException) {
        throw error;
      }
    }
  }
}
