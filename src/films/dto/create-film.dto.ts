import { IsArray, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFilmDto {
  
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsArray()
  @IsString({ each: true })
  characters: string[];

  @IsDateString()
  created: string;

  @IsString()
  director: string;

  @IsString()
  edited: string;

  @IsString()
  episode_id: string;

  @IsString()
  opening_crawl: string;

  @IsArray()
  @IsString({ each: true })
  planets: string[];

  @IsString()
  producer: string;

  @IsDateString()
  release_date: string;

  @IsArray()
  @IsString({ each: true })
  species: string[];

  @IsArray()
  @IsString({ each: true })
  starships: string[];

  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsArray()
  @IsString({ each: true })
  vehicles: string[];
}
