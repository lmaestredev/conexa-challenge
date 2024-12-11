import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFilmDto {

  @ApiProperty({
    description: 'Id of the film',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({  
    description: 'Characters of the film',
    example: ['https://swapi.dev/api/people/1/'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  characters: string[];

  @ApiProperty({
    description: 'Created date of the film',
    example: "2021-09-01T00:00:00.000Z",
    type: String,
  })
  @IsDateString()
  created: string;

  @ApiProperty({
    description: 'Director of the film',
    example: 'George Lucas',
    type: String,
  })
  @IsString()
  director: string;

  @ApiProperty({
    description: 'Edited date of the film',
    example: "2021-09-01T00:00:00.000Z",
    type: String,
  })
  @IsString()
  edited: string;

  @ApiProperty({
    description: 'Episode id of the film',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  episode_id: number;

  @ApiProperty({
    description: 'Opening crawl of the film',
    example: 'A long time ago in a galaxy far, far away...',
    type: String,
  })
  @IsString()
  opening_crawl: string;

  @ApiProperty({
    description: 'Planets of the film',
    example: ['https://swapi.dev/api/planets/1/'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  planets: string[];

  @ApiProperty({
    description: 'Producer of the film',
    example: 'Rick McCallum',
    type: String,
  })
  @IsString()
  producer: string;

  @ApiProperty({
    description: 'Release date of the film',
    example: "2021-09-01T00:00:00.000Z",
    type: String,
  })
  @IsDateString()
  release_date: string;

  @ApiProperty({
    description: 'Species of the film',
    example: ['https://swapi.dev/api/species/1/'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  species: string[];

  @ApiProperty({
    description: 'Starships of the film',
    example: ['https://swapi.dev/api/starships/1/'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  starships: string[];

  @ApiProperty({
    description: 'Title of the film',
    example: 'A New Hope',
    type: String
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Url of the film',
    example: 'https://swapi.dev/api/films/1/',
    type: String,
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Vehicles of the film',
    example: ['https://swapi.dev/api/vehicles/1/'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  vehicles: string[];
}
