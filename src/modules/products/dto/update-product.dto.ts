import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class UpdateProductDTO {
  @JoiSchema(Joi.string().uuid().optional())
  shopId?: string;

  @JoiSchema(Joi.string().trim().min(1).optional())
  name?: string;

  @JoiSchema(Joi.string().trim().min(1).optional())
  description?: string;

  @JoiSchema(Joi.number().integer().min(0).optional())
  price?: number;

  @JoiSchema(Joi.number().integer().min(1).optional())
  stockCount?: number;
}
