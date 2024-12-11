import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { StarwarsResponse } from './interfaces/starwars-response.interface';
import { Film } from '../films/entities/film.entity';
import { envs } from '../config';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  private readonly logger = new Logger('SeedController');

  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed(user: User) {
    await this.deleteTables();

    await this.insertFilms(user);

    return {
      message: 'Seed executed successfully'
    };
  }

  private async deleteTables() {
    await this.filmRepository.clear();
    await this.userRepository.clear();
  }

  async insertFilms(user: User) {

    this.logger.log('Rebuilding database');
    this.filmRepository.clear();

    const { data } = await this.axios.get<StarwarsResponse>(envs.apiStarWars);

    const filmsToInsert: Film[] = [];

    data.results.forEach(async (film) => {
      filmsToInsert.push(this.filmRepository.create({ ...film, user }));
    });

    await this.filmRepository.insert(filmsToInsert);
    this.logger.log('Database rebuilt');

    return true;
  }
}
