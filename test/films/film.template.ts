export class FilmTemplate {
  getFilm() {
    return {
      title: 'A New Hope',
      episode_id: 4,
      opening_crawl: 'It is a period ',
      director: 'George Lucas',
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
      characters: ['https://swapi.dev/api/people/1/'],
      planets: ['https://swapi.dev/api/planets/1/'],
      starships: ['https://swapi.dev/api/starships/2/'],
      vehicles: ['https://swapi.dev/api/vehicles/4/'],
      species: ['https://swapi.dev/api/species/1/'],
      created: '2014-12-10T14:23:31.880000Z',
      edited: '2014-12-20T19:49:45.256000Z',
      url: 'https://swapi.dev/api/films/1/',
    };
  }

  getFilmCreated() {
    return {
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
      characters: ['https://swapi.dev/api/people/1/'],
      created: '2014-12-10',
      director: 'George Lucas',
      edited: '2014-12-20T19:49:45.256000Z',
      episode_id: 4,
      opening_crawl: 'It is a period of .',
      planets: ['https://swapi.dev/api/planets/1/'],
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
      species: ['https://swapi.dev/api/species/1/'],
      starships: ['https://swapi.dev/api/starships/2/'],
      title: 'A New Hope',
      url: 'https://swapi.dev/api/films/1/',
      vehicles: ['https://swapi.dev/api/vehicles/4/'],
      user: {
        id: 'user-123',
        fullName: 'John Doe',
        username: 'johndoe',
        isActive: true,
        roles: ['admin'],
        checkFieldsBeforeInsert: jest.fn(),
        checkFieldsBeforeUpdate: jest.fn(),
      }
    };
  }
}
