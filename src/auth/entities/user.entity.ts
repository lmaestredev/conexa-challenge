import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column('text',{
        select: false,
    })
    password?: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: string[];

    @BeforeInsert()
    checkFieldsBeforeInsert(){ 
        this.username = this.username.toLowerCase();
    }
    
    @BeforeUpdate()
    checkFieldsBeforeUpdate(){ 
        this.checkFieldsBeforeInsert();
    }
}
