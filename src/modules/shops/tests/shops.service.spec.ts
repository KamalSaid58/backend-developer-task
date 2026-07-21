import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ShopsService } from '../shops.service';
import { ShopsRepository } from '../shops.repository';
import {
  buildCreateShopDto,
  buildShopDto,
  buildShopWithProductsDto,
  buildUpdateShopDto,
  shopIdFixture,
} from '../factories/shop.factory';

describe('ShopsService', () => {
  let service: ShopsService;
  let repository: {
    create: jest.Mock;
    findAll: jest.Mock;
    findAllWithProducts: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllWithProducts: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopsService,
        {
          provide: ShopsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ShopsService>(ShopsService);
  });

  it('should create a shop', async () => {
    const createShopDto = buildCreateShopDto();
    const createdShop = buildShopDto();
    repository.create.mockResolvedValue(createdShop);

    await expect(service.create(createShopDto)).resolves.toEqual(createdShop);

    expect(repository.create).toHaveBeenCalledWith(createShopDto);
  });

  it('should find all shops', async () => {
    const shops = [buildShopDto()];
    repository.findAll.mockResolvedValue(shops);

    await expect(service.findAll()).resolves.toEqual(shops);

    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should find all shops with products and map the result', async () => {
    const paginatedRows = [buildShopWithProductsDto()];
    repository.findAllWithProducts.mockResolvedValue({
      rows: paginatedRows,
      count: 1,
    });

    await expect(service.findAllWithProducts(10, 0)).resolves.toEqual({
      data: paginatedRows,
      total: 1,
      limit: 10,
      offset: 0,
    });

    expect(repository.findAllWithProducts).toHaveBeenCalledWith(10, 0);
  });

  it('should find a shop by id', async () => {
    const shop = buildShopDto();
    repository.findOne.mockResolvedValue(shop);

    await expect(service.findOne(shopIdFixture)).resolves.toEqual(shop);

    expect(repository.findOne).toHaveBeenCalledWith(shopIdFixture);
  });

  it('should throw when a shop cannot be found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(shopIdFixture)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repository.findOne).toHaveBeenCalledWith(shopIdFixture);
  });

  it('should update a shop when it exists', async () => {
    const updateShopDto = buildUpdateShopDto();
    const updatedShop = buildShopDto({ name: 'Downtown Shop Updated' });
    repository.findOne.mockResolvedValue(buildShopDto());
    repository.update.mockResolvedValue(updatedShop);

    await expect(service.update(shopIdFixture, updateShopDto)).resolves.toEqual(
      updatedShop,
    );

    expect(repository.findOne).toHaveBeenCalledWith(shopIdFixture);
    expect(repository.update).toHaveBeenCalledWith(
      shopIdFixture,
      updateShopDto,
    );
  });

  it('should throw when updating a missing shop', async () => {
    const updateShopDto = buildUpdateShopDto();
    repository.findOne.mockResolvedValue(null);

    await expect(
      service.update(shopIdFixture, updateShopDto),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should delete a shop when it exists', async () => {
    repository.findOne.mockResolvedValue(buildShopDto());
    repository.delete.mockResolvedValue(undefined);

    await expect(service.delete(shopIdFixture)).resolves.toBeUndefined();

    expect(repository.findOne).toHaveBeenCalledWith(shopIdFixture);
    expect(repository.delete).toHaveBeenCalledWith(shopIdFixture);
  });

  it('should throw when deleting a missing shop', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.delete(shopIdFixture)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repository.delete).not.toHaveBeenCalled();
  });
});
