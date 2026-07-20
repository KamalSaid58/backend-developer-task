import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ShopsService } from 'src/modules/shops/shops.service';
import { CreateProductDTO } from 'src/modules/products/dto/create-product.dto';
import { UpdateProductDTO } from 'src/modules/products/dto/update-product.dto';
import { ProductDTO } from 'src/modules/products/dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly repository: ProductsRepository,
    @Inject(forwardRef(() => ShopsService))
    private readonly shopsService: ShopsService,
  ) {}

  async findWithFilter(filter: Partial<ProductDTO>): Promise<ProductDTO[]> {
    return this.repository.findWithFilter(filter);
  }

  async create(product: CreateProductDTO): Promise<ProductDTO> {
    // Verify that the shop exists before creating the product
    const shop = await this.shopsService.findOne(product.shopId);
    if (!shop) {
      throw new BadRequestException(
        `Shop with ID "${product.shopId}" does not exist`,
      );
    }

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
