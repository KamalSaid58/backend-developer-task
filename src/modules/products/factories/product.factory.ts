import { CreateProductDTO } from '../dto/create-product.dto';
import { ProductDTO } from '../dto/product.dto';
import { UpdateProductDTO } from '../dto/update-product.dto';

export const shopIdFixture = '33333333-3333-3333-3333-333333333333';
export const productIdFixture = '44444444-4444-4444-4444-444444444444';

export const buildCreateProductDto = (
  overrides: Partial<CreateProductDTO> = {},
): CreateProductDTO => ({
  shopId: shopIdFixture,
  name: 'Coffee Beans',
  description: 'Fresh roasted coffee beans',
  price: 120,
  stockCount: 30,
  ...overrides,
});

export const buildUpdateProductDto = (
  overrides: Partial<UpdateProductDTO> = {},
): UpdateProductDTO => ({
  name: 'Dark Roast Coffee Beans',
  description: 'Updated description',
  price: 150,
  stockCount: 25,
  ...overrides,
});

export const buildProductDto = (
  overrides: Partial<ProductDTO> = {},
): ProductDTO => ({
  id: productIdFixture,
  shopId: shopIdFixture,
  name: 'Coffee Beans',
  description: 'Fresh roasted coffee beans',
  price: 120,
  stockCount: 30,
  ...overrides,
});
