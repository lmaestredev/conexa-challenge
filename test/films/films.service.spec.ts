import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Film } from '../../src/films/entities/film.entity';
import { FilmsService } from '../../src/films/films.service';
import { FilmTemplate } from './film.template';
import { User } from '../../src/auth/entities/user.entity';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  preload: jest.fn(),
};

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: Repository<Film>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: getRepositoryToken(Film),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<Repository<Film>>(getRepositoryToken(Film));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Create a new film successfully', async () => {
    const filmTemplate = new FilmTemplate();
    const createFilmDto = filmTemplate.getFilm();
  
    const newUser = new User();
    newUser.id = 'f12ed5eb-3452-4016-8b95-0b64c8bb5ef8';
    newUser.fullName = 'luis maestre';
    newUser.username = 'lmaestre256';
    newUser.isActive = true;
    newUser.roles = ['regular', 'admin'];
  
    const film = {
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
      ...createFilmDto,
      user: newUser.toJSON(),
    };
  
    mockRepository.create.mockReturnValue(film);
    mockRepository.save.mockResolvedValue(film);
  
    const result = await service.create(createFilmDto, newUser);
  
    expect(result).toEqual(film);
  });
  

  it('Handle exceptions', async () => {
    const filmTemplate = new FilmTemplate();
    const createFilmDto = filmTemplate.getFilm();
    const error = { code: '23505', detail: 'Duplicate entry' };
    const user = new User();
    user.id = 'f12ed5eb-3452-4016-8b95-0b64c8bb5ef8';
    user.fullName = 'luis maestre';
    user.username = 'lmaestre256';
    user.isActive = true;
    user.roles = ['regular', 'admin'];

    jest.spyOn(repository, 'create').mockImplementation(() => {
      throw error;
    });

    jest
      .spyOn(service as any, 'handleDBExceptions')
      .mockImplementation((err: any) => {
        if (err.code === '23505') {
          throw new BadRequestException(err.detail);
        }
        throw new InternalServerErrorException(
          'Unexpected error occurred, check the logs for details',
        );
      });

    await expect(service.create(createFilmDto, user)).rejects.toThrow(
      BadRequestException,
    );
    expect(service['handleDBExceptions']).toHaveBeenCalledWith(error);
  });

  it('Get all films', async () => {
    const filmTemplate = new FilmTemplate();
    const paginationDto = { limit: 1, offset: 0 };
    const createFilmDto = filmTemplate.getFilmCreated();
    const mockFilms: Film[] = [createFilmDto as unknown as Film];

    jest.spyOn(repository, 'find').mockResolvedValue(mockFilms);

    const result = await service.findAll(paginationDto);

    expect(repository.find).toHaveBeenCalledWith({ skip: 0, take: 1 });
    expect(result).toEqual(mockFilms);
  });

  it('Get film by term', async () => {
    const filmTemplate = new FilmTemplate();
    const mockFilms = filmTemplate.getFilmCreated();

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockFilms as unknown as Film);

    const result = await service.findOne(
      '85ab41bf-322f-42bf-8f7d-7b63ee092917',
    );

    expect(repository.findOneBy).toHaveBeenCalledWith({
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
    });
    expect(result).toEqual(mockFilms);
  });

  it('Throw NotFoundException if a film not founded', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    await expect(
      service.findOne('85ab41bf-322f-42bf-8f7d-7b63ee092917'),
    ).rejects.toThrow(NotFoundException);
    expect(repository.findOneBy).toHaveBeenCalledWith({
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
    });
  });

  it('Update a film successfully', async () => {
    const filmTemplate = new FilmTemplate();
    const updateFilmDto = filmTemplate.getFilm();
    const id = 'some-uuid';
  
    const user = new User();
    user.id = 'user-uuid';
    user.fullName = 'Luis Maestre';
    user.username = 'lmaestre256';
    user.isActive = true;
    user.roles = ['regular', 'admin'];
  
    const film = {
      id,
      ...updateFilmDto,
      user,
    };
  
    const updatedFilm = {
      ...film,
      user,
    };
  
    jest.spyOn(repository, 'preload').mockResolvedValue(film);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedFilm);
  
    const result = await service.update(id, updateFilmDto, user);
  
    expect(repository.preload).toHaveBeenCalledWith({
      id,
      ...updateFilmDto,
    });
  
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        ...film,
        user,
      })
    );
  
    expect(result).toEqual(updatedFilm);
  });
  

  it('Remove a film by ID', async () => {
    const filmTemplate = new FilmTemplate();
    const mockFilms = filmTemplate.getFilmCreated();
  
    const user = new User();
    user.id = 'user-uuid';
    user.fullName = 'Luis Maestre';
    user.username = 'lmaestre256';
    user.isActive = true;
    user.roles = ['regular', 'admin'];
  
    jest.spyOn(service, 'findOne').mockResolvedValue(mockFilms as unknown as Film);
    jest.spyOn(repository, 'remove').mockResolvedValue(mockFilms as any);
  
    await service.remove('85ab41bf-322f-42bf-8f7d-7b63ee092917');
  
    expect(service.findOne).toHaveBeenCalledWith(
      '85ab41bf-322f-42bf-8f7d-7b63ee092917',
    );
  
    expect(repository.remove).toHaveBeenCalledWith(mockFilms);
  });
  

  it('Throw NotFoundException if film to remove is not found', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

    await expect(
      service.remove('85ab41bf-322f-42bf-8f7d-7b63ee092917'),
    ).rejects.toThrow(NotFoundException);
    expect(service.findOne).toHaveBeenCalledWith(
      '85ab41bf-322f-42bf-8f7d-7b63ee092917',
    );
  });
});
