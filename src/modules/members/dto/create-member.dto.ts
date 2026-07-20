import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';
import { GENDER_OPTIONS } from 'src/common/enums/gender.enum';

export class CreateMemberDTO {
  @JoiSchema(Joi.string().trim().min(1).required())
  firstName: string;

  @JoiSchema(Joi.string().trim().min(1).required())
  lastName: string;

  @JoiSchema(
    Joi.string()
      .valid(...GENDER_OPTIONS)
      .required(),
  )
  gender: string;

  @JoiSchema(
    Joi.string()
      .regex(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)
      .required(),
  )
  dateOfBirth: string; // Format: DD-MM-YYYY (e.g., 17-07-2003) - Day: 01-31, Month: 01-12

  @JoiSchema(
    Joi.string()
      .regex(/^\+20\d{10,}$/)
      .optional(),
  )
  phone?: string; // Egyptian phone: must start with +20 and be at least 13 characters (e.g., +201001234567)

  @JoiSchema(Joi.string().uuid().optional().allow(null))
  centralMemberId?: string; // UUID of the central member (family reference)
}
