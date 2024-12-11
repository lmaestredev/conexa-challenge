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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { PaginationDto } from '../common/dtos';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';
import { Film } from './entities/film.entity';

@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'Film was created', type: Film })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Token releated' })
  create(
    @Body() createFilmDto: CreateFilmDto,
    @GetUser() user: User
  ) {
    return this.filmsService.create(createFilmDto, user);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Films retrieved successfully', type: [Film] })
  @ApiResponse({ status: 403, description: 'Token related' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.filmsService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth(ValidRoles.regular)
  @ApiResponse({ status: 200, description: 'Film retrieved successfully', type: Film })
  @ApiResponse({ status: 403, description: 'Token related' })
  @ApiResponse({ status: 404, description: 'Film not found' })
  findOne(@Param('term') term: string) {
    return this.filmsService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'Film updated successfully', type: Film })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Token related' })
  @ApiResponse({ status: 404, description: 'Film not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFilmDto: UpdateFilmDto,
    @GetUser() user: User

  ) {
    return this.filmsService.update(id, updateFilmDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'Film deleted successfully' })
  @ApiResponse({ status: 403, description: 'Token related' })
  @ApiResponse({ status: 404, description: 'Film not found' })
  remove(@Param('id') id: string) {
    return this.filmsService.remove(id);
  }
}
