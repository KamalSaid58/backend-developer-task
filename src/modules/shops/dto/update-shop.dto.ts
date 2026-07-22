import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';
import { AVAILABILITY_OPTIONS } from 'src/common/enums/availability.enum';
export class UpdateShopDTO {
  @JoiSchema(Joi.string().trim().min(1).optional())
  name?: string;

  @JoiSchema(
    Joi.string()
      .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
      .optional(),
  )
  openingHour?: string;

  @JoiSchema(
    Joi.string()
      .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
      .optional(),
  )
  closingHour?: string;

  @JoiSchema(
    Joi.string()
      .valid(...AVAILABILITY_OPTIONS)
      .optional(),
  )
  availability?: string;
}
