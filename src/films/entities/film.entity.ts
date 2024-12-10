import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({name: 'films'})
export class Film {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text', {
        array: true
    })
    characters: string[];

    @Column('date')
    created: string;

    @Column('text')
    director: string;

    @Column('text')
    edited: string;

    @Column('text')
    episode_id: string;

    @Column('text')
    opening_crawl: string;
    
    @Column('text', {
        array: true
    })
    planets: string[];

    @Column('text')
    producer: string;

    @Column('date')
    release_date: string;
    
    @Column('text', {
        array: true
    })
    species: string[];
    
    @Column('text', {
        array: true
    })
    starships: string[];

    @Column('text')
    title: string;

    @Column('text') 
    url: string;

    @Column('text', {
        array: true 
    })
    vehicles: string[];
    
}
