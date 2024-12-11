import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { PaginationDto } from '../common/dtos';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(
    @Body() createFilmDto: CreateFilmDto,
    @GetUser() user: User
  ) {
    return this.filmsService.create(createFilmDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.filmsService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth(ValidRoles.regular)
  findOne(@Param('term') term: string) {
    return this.filmsService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFilmDto: UpdateFilmDto,
    @GetUser() user: User

  ) {
    return this.filmsService.update(id, updateFilmDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.filmsService.remove(id);
  }
}
