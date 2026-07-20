import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';
import { AVAILABILITY_OPTIONS } from 'src/common/enums/availability.enum';

export class CreateShopDTO {
  @JoiSchema(Joi.string().trim().min(1).required())
  name: string;

  @JoiSchema(Joi.date().iso().required())
  openingHour: Date;

  @JoiSchema(Joi.date().iso().required())
  closingHour: Date;

  @JoiSchema(
    Joi.string()
      .valid(...AVAILABILITY_OPTIONS)
      .required(),
  )
  availability: string;
}
