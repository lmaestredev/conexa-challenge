import { User } from '../../auth/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'films' })
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    array: true,
  })
  characters: string[];

  @Column('date')
  created: string;

  @Column('text')
  director: string;

  @Column('text')
  edited: string;

  @Column('int')
  episode_id: number;

  @Column('text')
  opening_crawl: string;

  @Column('text', {
    array: true,
  })
  planets: string[];

  @Column('text')
  producer: string;

  @Column('date')
  release_date: string;

  @Column('text', {
    array: true,
  })
  species: string[];

  @Column('text', {
    array: true,
  })
  starships: string[];

  @Column('text')
  title: string;

  @Column('text')
  url: string;

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
