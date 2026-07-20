import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Product } from 'src/modules/products/products.model';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  async findWithFilter(filters: Partial<Product>): Promise<Product[]> {
    return this.productModel.findAll({ where: filters });
  }

  async create(product: Partial<Product>): Promise<Product> {
    return this.productModel.create(product);
  }

  async findAll(name?: string): Promise<Product[]> {
    const where: any = {};

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    return this.productModel.findAll({ where });
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findByPk(id);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const result = await this.productModel.update(product, {
      where: { id },
      returning: true,
    });

    return result[1][0];
  }

  async delete(id: string): Promise<void> {
    await this.productModel.destroy({ where: { id } });
  }
}
