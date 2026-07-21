import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { ProductsRepository } from '../products.repository';
import { ShopsService } from 'src/modules/shops/shops.service';
import {
  buildCreateProductDto,
  buildProductDto,
  buildUpdateProductDto,
  productIdFixture,
  shopIdFixture,
} from '../factories/product.factory';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: {
    findWithFilter: jest.Mock;
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let shopsService: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      findWithFilter: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    shopsService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: repository,
        },
        {
          provide: ShopsService,
          useValue: shopsService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should find products by filter', async () => {
    const products = [buildProductDto()];
    repository.findWithFilter.mockResolvedValue(products);

    await expect(service.findWithFilter({ name: 'coffee' })).resolves.toEqual(
      products,
    );

    expect(repository.findWithFilter).toHaveBeenCalledWith({ name: 'coffee' });
  });

  it('should create a product when the shop exists', async () => {
    const createProductDto = buildCreateProductDto();
    const createdProduct = buildProductDto();
    shopsService.findOne.mockResolvedValue({ id: shopIdFixture });
    repository.create.mockResolvedValue(createdProduct);

    await expect(service.create(createProductDto)).resolves.toEqual(
      createdProduct,
    );

    expect(shopsService.findOne).toHaveBeenCalledWith(shopIdFixture);
    expect(repository.create).toHaveBeenCalledWith(createProductDto);
  });

  it('should throw when creating a product for a missing shop', async () => {
    const createProductDto = buildCreateProductDto();
    shopsService.findOne.mockResolvedValue(null);

    await expect(service.create(createProductDto)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should find all products with an optional name filter', async () => {
    const products = [buildProductDto()];
    repository.findAll.mockResolvedValue(products);

    await expect(service.findAll('coffee')).resolves.toEqual(products);

    expect(repository.findAll).toHaveBeenCalledWith('coffee');
  });

  it('should find a product by id', async () => {
    const product = buildProductDto();
    repository.findOne.mockResolvedValue(product);

    await expect(service.findOne(productIdFixture)).resolves.toEqual(product);

    expect(repository.findOne).toHaveBeenCalledWith(productIdFixture);
  });

  it('should throw when a product cannot be found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(productIdFixture)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repository.findOne).toHaveBeenCalledWith(productIdFixture);
  });

  it('should update a product when the product exists and the new shop exists', async () => {
    const updateProductDto = buildUpdateProductDto({ shopId: shopIdFixture });
    const existingProduct = buildProductDto();
    const updatedProduct = buildProductDto({ name: 'Updated Product' });
    repository.findOne.mockResolvedValue(existingProduct);
    shopsService.findOne.mockResolvedValue({ id: shopIdFixture });
    repository.update.mockResolvedValue(updatedProduct);

    await expect(
      service.update(productIdFixture, updateProductDto),
    ).resolves.toEqual(updatedProduct);

    expect(repository.findOne).toHaveBeenCalledWith(productIdFixture);
    expect(shopsService.findOne).toHaveBeenCalledWith(shopIdFixture);
    expect(repository.update).toHaveBeenCalledWith(
      productIdFixture,
      updateProductDto,
    );
  });

  it('should throw when updating a missing product', async () => {
    const updateProductDto = buildUpdateProductDto();
    repository.findOne.mockResolvedValue(null);

    await expect(
      service.update(productIdFixture, updateProductDto),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(shopsService.findOne).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw when updating a product with a missing shop', async () => {
    const updateProductDto = buildUpdateProductDto({ shopId: shopIdFixture });
    repository.findOne.mockResolvedValue(buildProductDto());
    shopsService.findOne.mockResolvedValue(null);

    await expect(
      service.update(productIdFixture, updateProductDto),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should delete a product', async () => {
    repository.findOne.mockResolvedValue(buildProductDto());
    repository.delete.mockResolvedValue(undefined);

    await expect(service.delete(productIdFixture)).resolves.toBeUndefined();

    expect(repository.findOne).toHaveBeenCalledWith(productIdFixture);
    expect(repository.delete).toHaveBeenCalledWith(productIdFixture);
  });

  it('should throw when deleting a missing product', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.delete(productIdFixture)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repository.delete).not.toHaveBeenCalled();
  });
});
