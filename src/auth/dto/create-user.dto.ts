import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    type: String
  })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'johndoe',
    type: String,
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Password123',
    type: String,
  })
  @IsString()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
