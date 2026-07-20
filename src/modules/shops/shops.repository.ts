import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Shop } from 'src/modules/shops/shops.model';
import { Product } from 'src/modules/products/products.model';

@Injectable()
export class ShopsRepository {
  constructor(@InjectModel(Shop) private readonly shopModel: typeof Shop) {}

  async create(shop: Partial<Shop>): Promise<Shop> {
    return this.shopModel.create(shop);
  }

  async findAll(): Promise<Shop[]> {
    return this.shopModel.findAll();
  }

  /**
   * Fetch all shops with their products using eager loading (fixes N+1 problem)
   * @param limit - Maximum number of shops to return (default: unlimited)
   * @param offset - Number of shops to skip for pagination (default: 0)
   * @returns Shops with eagerly loaded products
   */
  async findAllWithProducts(limit?: number, offset?: number): Promise<Shop[]> {
    return this.shopModel.findAll({
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'shopId',
            'name',
            'description',
            'price',
            'stockCount',
          ],
        },
      ],
      limit,
      offset: offset || 0,
    });
  }

  async findOne(id: string): Promise<Shop> {
    return this.shopModel.findByPk(id);
  }

  async update(id: string, shop: Partial<Shop>): Promise<Shop> {
    const result = await this.shopModel.update(shop, {
      where: { id },
      returning: true,
    });

    return result[1][0];
  }

  async delete(id: string): Promise<void> {
    await this.shopModel.destroy({ where: { id } });
  }
}
