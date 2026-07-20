import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDTO } from './dto/create-shop.dto';
import { UpdateShopDTO } from './dto/update-shop.dto';
import { ShopDTO } from './dto/shop.dto';
import { ShopWithProductsDTO } from 'src/modules/shops/dto/shop-with-products.dto';
import { PaginatedResponseDTO } from 'src/common/dto/paginated-response.dto';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  async create(@Body() createShopDto: CreateShopDTO): Promise<ShopDTO> {
    return this.shopsService.create(createShopDto);
  }

  @Get()
  async findAll(): Promise<ShopDTO[]> {
    return this.shopsService.findAll();
  }

  @Get('with-products')
  async findAllWithProducts(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<PaginatedResponseDTO<ShopWithProductsDTO>> {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    return this.shopsService.findAllWithProducts(parsedLimit, parsedOffset);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ShopDTO> {
    return this.shopsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShopDto: UpdateShopDTO,
  ): Promise<ShopDTO> {
    return this.shopsService.update(id, updateShopDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.shopsService.delete(id);
  }
}
