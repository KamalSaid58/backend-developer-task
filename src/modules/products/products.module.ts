import { Module } from '@nestjs/common';
import { ProductsController } from 'src/modules/products/products.controller';
import { ProductsService } from 'src/modules/products/products.service';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ShopsModule } from 'src/modules/shops/shops.module';

@Module({
  imports: [ShopsModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
