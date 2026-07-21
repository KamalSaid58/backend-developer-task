import { Test, TestingModule } from '@nestjs/testing';
import { ShopsController } from '../shops.controller';
import { ShopsService } from '../shops.service';
import {
  buildCreateShopDto,
  buildShopDto,
  buildShopWithProductsDto,
  buildUpdateShopDto,
  shopIdFixture,
} from '../factories/shop.factory';

describe('ShopsController', () => {
  let controller: ShopsController;
  let shopsService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findAllWithProducts: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    shopsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllWithProducts: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopsController],
      providers: [
        {
          provide: ShopsService,
          useValue: shopsService,
        },
      ],
    }).compile();

    controller = module.get<ShopsController>(ShopsController);
  });

  it('should create a shop through the service', async () => {
    const createShopDto = buildCreateShopDto();
    const createdShop = buildShopDto();
    shopsService.create.mockResolvedValue(createdShop);

    await expect(controller.create(createShopDto)).resolves.toEqual(
      createdShop,
    );

    expect(shopsService.create).toHaveBeenCalledWith(createShopDto);
  });

  it('should find all shops through the service', async () => {
    const shops = [buildShopDto()];
    shopsService.findAll.mockResolvedValue(shops);

    await expect(controller.findAll()).resolves.toEqual(shops);

    expect(shopsService.findAll).toHaveBeenCalledWith();
  });

  it('should find all shops with products using default pagination values', async () => {
    const paginatedShops = {
      data: [buildShopWithProductsDto()],
      total: 1,
      limit: 10,
      offset: 0,
    };
    shopsService.findAllWithProducts.mockResolvedValue(paginatedShops);

    await expect(controller.findAllWithProducts()).resolves.toEqual(
      paginatedShops,
    );

    expect(shopsService.findAllWithProducts).toHaveBeenCalledWith(10, 0);
  });

  it('should find all shops with products using provided pagination values', async () => {
    const paginatedShops = {
      data: [buildShopWithProductsDto()],
      total: 1,
      limit: 25,
      offset: 5,
    };
    shopsService.findAllWithProducts.mockResolvedValue(paginatedShops);

    await expect(controller.findAllWithProducts('25', '5')).resolves.toEqual(
      paginatedShops,
    );

    expect(shopsService.findAllWithProducts).toHaveBeenCalledWith(25, 5);
  });

  it('should find a shop by id through the service', async () => {
    const shop = buildShopDto();
    shopsService.findOne.mockResolvedValue(shop);

    await expect(controller.findOne(shopIdFixture)).resolves.toEqual(shop);

    expect(shopsService.findOne).toHaveBeenCalledWith(shopIdFixture);
  });

  it('should update a shop through the service', async () => {
    const updateShopDto = buildUpdateShopDto({ availability: undefined });
    const updatedShop = buildShopDto({ name: 'Downtown Shop Updated' });
    shopsService.update.mockResolvedValue(updatedShop);

    await expect(
      controller.update(shopIdFixture, updateShopDto),
    ).resolves.toEqual(updatedShop);

    expect(shopsService.update).toHaveBeenCalledWith(
      shopIdFixture,
      updateShopDto,
    );
  });

  it('should delete a shop through the service', async () => {
    shopsService.delete.mockResolvedValue(undefined);

    await expect(controller.delete(shopIdFixture)).resolves.toBeUndefined();

    expect(shopsService.delete).toHaveBeenCalledWith(shopIdFixture);
  });
});
