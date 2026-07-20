import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { GENDER_OPTIONS } from 'src/common/enums/gender.enum';

export class UpdateMemberDTO {
  @JoiSchema(Joi.string().trim().min(1).optional())
  firstName?: string;

  @JoiSchema(Joi.string().trim().min(1).optional())
  lastName?: string;

  @JoiSchema(
    Joi.string()
      .valid(...GENDER_OPTIONS)
      .optional(),
  )
  gender?: string;

  @JoiSchema(
    Joi.string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .optional(),
  )
  dateOfBirth?: string; // Format: YYYY-MM-DD (e.g., 2003-07-17) - Year: any, Month: 01-12, Day: 01-31

  @JoiSchema(
    Joi.string()
      .regex(/^\+20\d{10,}$/)
      .optional(),
  )
  phone?: string; // Egyptian phone: must start with +20 and be at least 13 characters (e.g., +201001234567)

  @JoiSchema(Joi.string().uuid().optional().allow(null))
  centralMemberId?: string;
}
