import { Module } from '@nestjs/common';
import { SellerController } from './controllers/seller.controller';
import { SellerService } from './services/seller.service';

@Module({
  imports: [],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [],
})
export class SellerModule {}
