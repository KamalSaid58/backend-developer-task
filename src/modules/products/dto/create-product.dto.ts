import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateProductDTO {
  @JoiSchema(Joi.string().uuid().required())
  shopId: string;

  @JoiSchema(Joi.string().trim().min(1).required())
  name: string;

  @JoiSchema(Joi.string().trim().min(1).required())
  description: string;

  @JoiSchema(Joi.number().integer().min(0).required())
  price: number;

  @JoiSchema(Joi.number().integer().min(1).required())
  stockCount: number;
}
