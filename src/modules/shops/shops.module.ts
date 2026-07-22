import { Module } from '@nestjs/common';
import { ShopsController } from 'src/modules/shops/shops.controller';
import { ShopsService } from 'src/modules/shops/shops.service';
import { ShopsRepository } from 'src/modules/shops/shops.repository';

@Module({
  imports: [],
  controllers: [ShopsController],
  providers: [ShopsService, ShopsRepository],
  exports: [ShopsService, ShopsRepository],
})
export class ShopsModule {}
