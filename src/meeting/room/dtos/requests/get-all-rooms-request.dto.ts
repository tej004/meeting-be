import { Transform } from 'class-transformer';
import {
  IsBoolean,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsActiveStrict', async: false })
class IsActiveStrictConstraint implements ValidatorConstraintInterface {
  validate(value: boolean | undefined, args: ValidationArguments) {
    const rawValue = (args.object as any)['isActive_raw'];
    if (rawValue === undefined || rawValue === null || rawValue === '')
      return true;
    if (rawValue === 'true' || rawValue === 'false') return true;
    return false;
  }
  defaultMessage(args: ValidationArguments) {
    return 'isActive must be either "true" or "false" if provided.';
  }
}

export class GetAllRoomsRequestDto {
  @Transform(({ value, obj }) => {
    obj['isActive_raw'] = value;
    if (value === undefined || value === null || value === '') return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  @Validate(IsActiveStrictConstraint)
  isActive?: boolean;
}
