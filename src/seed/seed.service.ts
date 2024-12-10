import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { StarwarsResponse } from './interfaces/starwars-response.interface';
import { Film } from 'src/films/entities/film.entity';
import { envs } from 'src/config';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  private readonly logger = new Logger('SeedController');

  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}

  async executedSeed() {

    this.logger.log('Rebuilding database');
    this.filmRepository.clear();

    const { data } = await this.axios.get<StarwarsResponse>(envs.apiStarWars);

    const filmsToInsert: Film[] = [];

    data.results.forEach(async (film) => {
      filmsToInsert.push(this.filmRepository.create(film));
    });
    
    await this.filmRepository.insert(filmsToInsert);
    this.logger.log('Database rebuilt');
    
    return {
      message: 'Seed executed successfully'
    };
  }
}
