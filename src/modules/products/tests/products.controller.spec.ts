import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import {
  buildCreateProductDto,
  buildProductDto,
  buildUpdateProductDto,
  productIdFixture,
} from '../factories/product.factory';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    productsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should create a product through the service', async () => {
    const createProductDto = buildCreateProductDto();
    const createdProduct = buildProductDto();
    productsService.create.mockResolvedValue(createdProduct);

    await expect(controller.create(createProductDto)).resolves.toEqual(
      createdProduct,
    );

    expect(productsService.create).toHaveBeenCalledWith(createProductDto);
  });

  it('should find all products without a filter', async () => {
    const products = [buildProductDto()];
    productsService.findAll.mockResolvedValue(products);

    await expect(controller.findAll()).resolves.toEqual(products);

    expect(productsService.findAll).toHaveBeenCalledWith(undefined);
  });

  it('should find all products with a name filter', async () => {
    const products = [buildProductDto()];
    productsService.findAll.mockResolvedValue(products);

    await expect(controller.findAll('coffee')).resolves.toEqual(products);

    expect(productsService.findAll).toHaveBeenCalledWith('coffee');
  });

  it('should find a product by id through the service', async () => {
    const product = buildProductDto();
    productsService.findOne.mockResolvedValue(product);

    await expect(controller.findOne(productIdFixture)).resolves.toEqual(
      product,
    );

    expect(productsService.findOne).toHaveBeenCalledWith(productIdFixture);
  });

  it('should update a product through the service', async () => {
    const updateProductDto = buildUpdateProductDto({ shopId: undefined });
    const updatedProduct = buildProductDto({ name: 'Dark Roast Coffee Beans' });
    productsService.update.mockResolvedValue(updatedProduct);

    await expect(
      controller.update(productIdFixture, updateProductDto),
    ).resolves.toEqual(updatedProduct);

    expect(productsService.update).toHaveBeenCalledWith(
      productIdFixture,
      updateProductDto,
    );
  });

  it('should delete a product through the service', async () => {
    productsService.delete.mockResolvedValue(undefined);

    await expect(controller.delete(productIdFixture)).resolves.toBeUndefined();

    expect(productsService.delete).toHaveBeenCalledWith(productIdFixture);
  });
});
