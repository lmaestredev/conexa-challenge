import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FilmsController } from '../../src/films/films.controller';
import { FilmsService } from '../../src/films/films.service';
import { FilmTemplate } from './film.template';

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
    const result = {
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
      ...createFilmDto,
    };

    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createFilmDto)).toBe(result);
    expect(service.create).toHaveBeenCalledWith(createFilmDto);
  });

  it('Get all films with pagination', async () => {
    const paginationDto: PaginationDto = { limit: 10, offset: 0 };
    const filmTemplate = new FilmTemplate();
    const result = [filmTemplate.getFilmCreated()];

    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    expect(await controller.findAll(paginationDto)).toBe(result);
    expect(service.findAll).toHaveBeenCalledWith(paginationDto);
  });

  it('Get film by ID', async () => {
    const filmId = '85ab41bf-322f-42bf-8f7d-7b63ee092917';
    const filmTemplate = new FilmTemplate();
    const result = filmTemplate.getFilmCreated();

    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    expect(await controller.findOne(filmId)).toBe(result);
    expect(service.findOne).toHaveBeenCalledWith(filmId);
  });

  it('Update an existing film', async () => {
    const filmTemplate = new FilmTemplate();
    const updateFilmDto = filmTemplate.getFilm();
    const id = '85ab41bf-322f-42bf-8f7d-7b63ee092917';
    const result = { id, ...updateFilmDto };

    jest.spyOn(service, 'update').mockResolvedValue(result);

    expect(await controller.update(id, updateFilmDto)).toBe(result);
    expect(service.update).toHaveBeenCalledWith(id, updateFilmDto);
  });

  it('Remove a film by ID', async () => {
    const userId = '85ab41bf-322f-42bf-8f7d-7b63ee092917';
    const result = 'Film removed';

    jest.spyOn(service, 'remove').mockResolvedValue(result);

    expect(await controller.remove(userId)).toBe(result);
    expect(service.remove).toHaveBeenCalledWith(userId);
  });
});
