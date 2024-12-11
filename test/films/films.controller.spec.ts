import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FilmsController } from '../../src/films/films.controller';
import { FilmsService } from '../../src/films/films.service';
import { FilmTemplate } from './film.template';
import { User } from '../../src/auth/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Film } from 'src/films/entities/film.entity';

const mockFilmsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
};

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('Create a new film', async () => {
    const filmTemplate = new FilmTemplate();
    const createFilmDto = filmTemplate.getFilm();

    const newUser = new User();
    newUser.id = 'f12ed5eb-3452-4016-8b95-0b64c8bb5ef8';
    newUser.fullName = 'luis maestre';
    newUser.username = 'lmaestre256';
    newUser.isActive = true;
    newUser.roles = ['regular', 'admin'];
    
    const objectResult = {
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
      ...createFilmDto,
      user: newUser.toJSON(),
    };

    mockFilmsService.create.mockResolvedValue(objectResult);
    const result = await controller.create(createFilmDto, newUser);
    expect(result).toBe(objectResult);
  });

  it('Get all films with pagination', async () => {
    const paginationDto: PaginationDto = { limit: 10, offset: 0 };
    const filmTemplate = new FilmTemplate();
    const filmDto = filmTemplate.getFilmCreated();
    const mockFilms: Film[] = [filmDto as unknown as Film];

    mockFilmsService.findAll.mockResolvedValue(mockFilms);

    const result = await controller.findAll(paginationDto);
    expect(result).toBe(mockFilms);
    expect(mockFilmsService.findAll).toHaveBeenCalledWith(paginationDto);
  });

  it('Get film by ID', async () => {
    const filmId = '85ab41bf-322f-42bf-8f7d-7b63ee092917';
    const filmTemplate = new FilmTemplate();
    const result = filmTemplate.getFilmCreated();

    mockFilmsService.findOne.mockResolvedValue(result);

    const response = await controller.findOne(filmId);
    expect(response).toBe(result);
    expect(mockFilmsService.findOne).toHaveBeenCalledWith(filmId);
  });

  it('Get film by ID', async () => {
    const filmId = '85ab41bf-322f-42bf-8f7d-7b63ee092917';
    const filmTemplate = new FilmTemplate();
    const result = filmTemplate.getFilmCreated();

    mockFilmsService.findOne.mockResolvedValue(result);

    const response = await controller.findOne(filmId);
    expect(response).toBe(result);
    expect(mockFilmsService.findOne).toHaveBeenCalledWith(filmId);
  });

  it('Remove a film by ID', async () => {
    const userId = '85ab41bf-322f-42bf-8f7d-7b63ee092917';
    const result = { message: 'Film removed'};

    jest.spyOn(service, 'remove').mockResolvedValue(result);

    expect(await controller.remove(userId)).toBe(result);
    expect(service.remove).toHaveBeenCalledWith(userId);
  });
});
