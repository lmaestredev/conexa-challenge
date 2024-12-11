import { ApiProperty } from '@nestjs/swagger';
import { Film } from '../../films/entities/film.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {

  @ApiProperty({
    example: '7e34a229-9a3c-4fe4-a91e-bbaf63ef42f8',
    description: 'The unique identifier of the user',
    format: 'uuid',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Luke Skywalker',
    description: 'The full name of the user',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: 'luke123',
    description: 'The username of the user',
  })
  @Column('text', {
    unique: true,
  })
  username: string;

  @ApiProperty({
    example: '$2b$10$WdTGMkYDq1TKriCtc62M7.Isd5772ro4HUYcfiZDYw/ZaNkFe8mp2',
    description: 'The password of the user',
  })
  @Column('text', {
    select: false,
  })
  password?: string;

  @ApiProperty({
    example: true,
    description: 'The status of the user',
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: ['regular'],
    description: 'The roles of the user',
  })
  @Column('text', {
    array: true,
    default: ['regular'],
  })
  roles: string[];

  @ApiProperty({
    example: ["011b3f68-8b0b-4f0b-8f1d-0c8e0e8e0b0c"],
    description: 'Films that the user has created',
  })
  @OneToMany(
    () => Film,
    (film) => film.user,
  )
  film: Film;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.username = this.username.toLowerCase();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }

  toJSON() {
    return {
      id: this.id,
      fullName: this.fullName,
      username: this.username,
      isActive: this.isActive,
      roles: this.roles,
    };
  }
}
