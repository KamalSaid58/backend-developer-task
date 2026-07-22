import { CreateShopDTO } from '../dto/create-shop.dto';
import { ShopDTO } from '../dto/shop.dto';
import { ShopWithProductsDTO } from '../dto/shop-with-products.dto';
import { UpdateShopDTO } from '../dto/update-shop.dto';

export const shopIdFixture = '55555555-5555-5555-5555-555555555555';
export const productIdFixture = '66666666-6666-6666-6666-666666666666';

export const buildCreateShopDto = (
  overrides: Partial<CreateShopDTO> = {},
): CreateShopDTO => ({
  name: 'Downtown Shop',
  openingHour: '08:00:00',
  closingHour: '20:00:00',
  availability: 'open',
  ...overrides,
});

export const buildUpdateShopDto = (
  overrides: Partial<UpdateShopDTO> = {},
): UpdateShopDTO => ({
  name: 'Downtown Shop Updated',
  openingHour: '09:00:00',
  closingHour: '21:00:00',
  availability: 'open',
  ...overrides,
});

export const buildShopDto = (overrides: Partial<ShopDTO> = {}): ShopDTO => ({
  id: shopIdFixture,
  name: 'Downtown Shop',
  openingHour: '08:00:00',
  closingHour: '20:00:00',
  availability: 'open',
  ...overrides,
});

export const buildShopWithProductsDto = (
  overrides: Partial<ShopWithProductsDTO> = {},
): ShopWithProductsDTO => ({
  id: shopIdFixture,
  name: 'Downtown Shop',
  openingHour: '08:00:00',
  closingHour: '20:00:00',
  availability: 'open',
  products: [
    {
      id: productIdFixture,
      shopId: shopIdFixture,
      name: 'Coffee Beans',
      description: 'Fresh roasted coffee beans',
      price: 120,
      stockCount: 30,
    },
  ],
  ...overrides,
});
