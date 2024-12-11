import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { PaginationDto } from '../common/dtos';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';
import { User } from './entities/user.entity';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.authService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id') term: string) {
    return this.authService.findOne(term);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.authService.remove(id, user);
  }
}
