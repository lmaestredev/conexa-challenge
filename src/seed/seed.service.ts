import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { StarwarsResponse } from './interfaces/starwars-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from 'src/films/entities/film.entity';
import { Repository } from 'typeorm';
import { envs } from 'src/config';



@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;
  
  constructor(

    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}
  
  async executedSeed() { 

    this.filmRepository.clear();

    const { data } = await this.axios.get<StarwarsResponse>(envs.apiStarWars);

    const filmsToInsert: Film[] = [];
    
    data.results.forEach(async (film) => {
      filmsToInsert.push(this.filmRepository.create(film));
    });
    await this.filmRepository.insert(filmsToInsert);
    return 'Seed executed successfully';
  } 
}


