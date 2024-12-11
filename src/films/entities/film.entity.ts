import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'films' })
export class Film {

  @ApiProperty({
    example: '7e34a229-9a3c-4fe4-a91e-bbaf63ef42f8',
    description: 'The unique identifier of the film',
    format: 'uuid',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: [
      "https://swapi.dev/api/people/1/",
		  "https://swapi.dev/api/people/2/"
    ],
    description: 'The characters that appear in the film',
  })
  @Column('text', {
    array: true,
  })
  characters: string[];

  @ApiProperty({
    example: "2014-12-10T14:23:31.880000Z",
    description: 'The date the film was created',
    format: 'date',
  })
  @Column('date')
  created: string;

  @ApiProperty({
      example: "James Cameron",
      description: 'The director of the film',
  })
  @Column('text')
  director: string;

  @ApiProperty({
    example: "2014-12-10T14:23:31.880000Z",
    description: 'The date the film was edited',
    format: 'date',
  })
  @Column('date')
  edited: string;

  @ApiProperty({
    example: 1,
    description: 'The episode id of the film',
  })
  @Column('int')
  episode_id: number;

  @ApiProperty({
    example: "A long time ago in a galaxy far, far away...",
    description: 'The opening crawl of the film',
  })
  @Column('text')
  opening_crawl: string;

  @ApiProperty({
    example: [
      "https://swapi.dev/api/planets/1/",
      "https://swapi.dev/api/planets/2/"
    ],
    description: 'The planets that appear in the film',
  })
  @Column('text', {
    array: true,
  })
  planets: string[];

  @ApiProperty({
    example: "Rick McCallum",
    description: 'The producer of the film',
  })
  @Column('text')
  producer: string;

  @ApiProperty({
    example: "2014-12-10T14:23:31.880000Z",
    description: 'The date the film was released',
    format: 'date',
  })
  @Column('date')
  release_date: string;

  @ApiProperty({
    example: [
      "https://swapi.dev/api/species/1/",
      "https://swapi.dev/api/species/2/"
    ],
    description: 'The species that appear in the film',
  })
  @Column('text', {
    array: true,
  })
  species: string[];

  @ApiProperty({
    example: [
      "https://swapi.dev/api/starships/1/",
      "https://swapi.dev/api/starships/2/"
    ],
    description: 'The starships that appear in the film',
  })
  @Column('text', {
    array: true,
  })
  starships: string[];

  @ApiProperty({
    example: "A New Hope",
    description: 'The title of the film',
  })
  @Column('text')
  title: string;

  @ApiProperty({
    example: "https://swapi.dev/api/films/1/",
    description: 'URL of the film',
  })
  @Column('text')
  url: string;

  @ApiProperty({
    example: [
      "https://swapi.dev/api/vehicles/1/",
      "https://swapi.dev/api/vehicles/2/"
    ],
    description: 'The vehicles that appear in the film',
  })
  @Column('text', {
    array: true,
  })
  vehicles: string[];

  @ManyToOne(
    () => User, 
    ( user ) => user.film,
    { eager: true }
  )
  user: User;
}
