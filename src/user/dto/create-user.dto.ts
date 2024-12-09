import { IsString, Matches, MinLength } from "class-validator";

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserDto {
  
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  name: string;

  @IsString()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  username: string;

  @IsString()
  // @Matches(passwordRegEx, {
  // message: `Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character`})
  password: string;
}
