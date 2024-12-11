import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';

import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger('FilmsService');

  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}

  async create(createFilmDto: CreateFilmDto, user: User) {
    try {
      const film = this.filmRepository.create({...createFilmDto, user});
      await this.filmRepository.save(film);
      return film;
    } catch (err) {
      this.handleDBExceptions(err);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.filmRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(term: string) {
    let film: Film | null;

    if (isUUID(term)) {
      film = await this.filmRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.filmRepository.createQueryBuilder('film');
      film = await queryBuilder
        .where(
          'UPPER(title) LIKE :term OR UPPER(producer) LIKE :term OR UPPER(director) LIKE :term',
          { term: `%${term.toUpperCase()}%` },
        )
        .getOne();
    }

    if (!film) throw new NotFoundException(`Film with ${term} not found`);

    return film;
  }

  async update(id: string, updateFilmDto: UpdateFilmDto, user: User) {
    const film = await this.filmRepository.preload({
      id: id,
      ...updateFilmDto,
    });

    if (!film) throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      film.user = user;
      await this.filmRepository.save(film);
      return film;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const film = await this.findOne(id);
    await this.filmRepository.remove(film);
    return {
      message: `Film with id: ${id} removed`
    };
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
