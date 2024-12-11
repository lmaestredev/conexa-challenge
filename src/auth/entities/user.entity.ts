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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text', {
    unique: true,
  })
  username: string;

  @Column('text', {
    select: false,
  })
  password?: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['regular'],
  })
  roles: string[];

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
