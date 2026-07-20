import { Injectable } from '@nestjs/common';
import { CreateShopDTO } from 'src/modules/shops/dto/create-shop.dto';
import { ShopWithProductsDTO } from 'src/modules/shops/dto/shop-with-products.dto';
import { ShopDTO } from 'src/modules/shops/dto/shop.dto';
import { UpdateShopDTO } from 'src/modules/shops/dto/update-shop.dto';
import { ShopsRepository } from 'src/modules/shops/shops.repository';
import { PaginatedResponseDTO } from 'src/common/dto/paginated-response.dto';

@Injectable()
export class ShopsService {
  constructor(private readonly repository: ShopsRepository) {}

  async create(shop: CreateShopDTO): Promise<ShopDTO> {
    return this.repository.create(shop);
  }

  async findAll(): Promise<ShopDTO[]> {
    return this.repository.findAll();
  }

  /**
   * Finds all shops with their products using eager loading.
   * This eliminates the N+1 query problem.
   *
   * @param limit - Maximum number of shops to return
   * @param offset - Number of shops to skip (for pagination)
   * @returns Paginated shops with their products eager-loaded
   */
  async findAllWithProducts(
    limit?: number,
    offset?: number,
  ): Promise<PaginatedResponseDTO<ShopWithProductsDTO>> {
    const { rows, count } = await this.repository.findAllWithProducts(
      limit,
      offset,
    );

    // Map the model to DTO (products are already included)
    const data = rows.map((shop) => ({
      id: shop.id,
      name: shop.name,
      openingHour: shop.openingHour,
      closingHour: shop.closingHour,
      availability: shop.availability,
      products: (shop.products || []).map((product) => ({
        id: product.id,
        shopId: product.shopId,
        name: product.name,
        description: product.description,
        price: product.price,
        stockCount: product.stockCount,
      })),
    }));

    return {
      data,
      total: count,
      limit: limit,
      offset: offset,
    };
  }

  async findOne(id: string): Promise<ShopDTO> {
    return this.repository.findOne(id);
  }

  async update(id: string, shop: UpdateShopDTO): Promise<ShopDTO> {
    return this.repository.update(id, shop);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
