import { Injectable } from '@nestjs/common';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { CreateProductDTO } from 'src/modules/products/dto/create-product.dto';
import { UpdateProductDTO } from 'src/modules/products/dto/update-product.dto';
import { ProductDTO } from 'src/modules/products/dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async findWithFilter(filter: Partial<ProductDTO>): Promise<ProductDTO[]> {
    return this.repository.findWithFilter(filter);
  }

  async create(product: CreateProductDTO): Promise<ProductDTO> {
    return this.repository.create(product);
  }

  async findAll(name?: string): Promise<ProductDTO[]> {
    return this.repository.findAll(name);
  }

  async findOne(id: string): Promise<ProductDTO> {
    return this.repository.findOne(id);
  }

  async update(id: string, product: UpdateProductDTO): Promise<ProductDTO> {
    return this.repository.update(id, product);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
