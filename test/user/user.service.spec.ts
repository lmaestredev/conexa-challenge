import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from '../../src/auth/entities/user.entity';
import { AuthService } from '../../src/auth/auth.service';
import { Repository } from 'typeorm';
import { Film } from '../../src/films/entities/film.entity';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
  findOne: jest.fn(),
};

const mockUser = {
  id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
  fullName: 'John Doe',
  username: 'johndoe',
  password: '$2b$10$JjwHs584TYbUqZcKWIiPxuq2EOpIieWl4X/bmlm7get4Xqr.e7mw6',
  isActive: true,
  roles: ['user'],
  film: {} as Film,
  checkFieldsBeforeInsert: jest.fn(),
  checkFieldsBeforeUpdate: jest.fn(),
  toJSON: jest.fn(),
};

const mockUserToDelete = {
  id: '85ab41bf-322f-42bf-8f7d-7b63ee092919',
  fullName: 'John Doe2',
  username: 'johndoe2',
  password: '$2b$10$JjwHs584TYbUqZcKWIiPxuq2EOpIieWl4X/bmlm7get4Xqr.e7mw6',
  isActive: true,
  roles: ['user'],
  film: {} as Film,
  checkFieldsBeforeInsert: jest.fn(),
  checkFieldsBeforeUpdate: jest.fn(),
  toJSON: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockJwtToken'),
};

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Create a new user successfully', async () => {
    const createUserDto = {
      fullName: 'John Doe',
      username: 'john123',
      password: 'password',
    };
    const hashedPassword =
      '$2b$10$JjwHs584TYbUqZcKWIiPxuq2EOpIieWl4X/bmlm7get4Xqr.e7mw6';
    const user = {
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
      ...createUserDto,
      password: hashedPassword,
    };

    jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);
    mockRepository.create.mockReturnValue(user);
    mockRepository.save.mockResolvedValue(user);

    const result = await service.create(createUserDto);

    expect(mockRepository.create).toHaveBeenCalledWith({
      fullName: 'John Doe',
      username: 'john123',
      password: hashedPassword,
    });
    expect(mockRepository.save).toHaveBeenCalledWith(user);
    expect(result).toEqual({
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
      fullName: 'John Doe',
      username: 'john123',
      token: 'mockJwtToken',
    });
  });

  it('Handle exceptions', async () => {
    const createUserDto = {
      fullName: 'John Doe',
      username: 'johndoe',
      password: 'Password@123',
    };
    const error = { code: '23505', detail: 'Duplicate entry' };

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

    await expect(service.create(createUserDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(service['handleDBExceptions']).toHaveBeenCalledWith(error);
  });

  it('Login a user successfully', async () => {
    const loginUserDto = { username: 'john123', password: 'password' };
    const hashedPassword =
      '$2b$10$JjwHs584TYbUqZcKWIiPxuq2EOpIieWl4X/bmlm7get4Xqr.e7mw6';
    const user = {
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
      username: 'john123',
      password: hashedPassword,
    };

    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
    mockRepository.findOne.mockResolvedValue(user);

    const result = await service.login(loginUserDto);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { username: 'john123' },
      select: { username: true, password: true, id: true },
    });
    expect(result).toEqual({
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
      username: 'john123',
      token: 'mockJwtToken',
      password: hashedPassword,
    });
  });

  it('Throw UnauthorizedException if user not found', async () => {
    const loginUserDto = { username: 'john123', password: 'password' };

    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.login(loginUserDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const loginUserDto = { username: 'john123', password: 'password' };
    const hashedPassword =
      '$2b$10$JjwHs584TYbUqZcKWIiPxuq2EOpIieWl4X/bmlm7get4Xqr.e7mw6';
    const user = {
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
      username: 'john123',
      password: hashedPassword,
    };

    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
    mockRepository.findOne.mockResolvedValue(user);

    await expect(service.login(loginUserDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('Get all users', async () => {
    const mockUsers = [
      {
        id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
        fullName: 'John Doe',
        username: 'johndoe',
        password:
          '$2b$10$JjwHs584TYbUqZcKWIiPxuq2EOpIieWl4X/bmlm7get4Xqr.e7mw6',
        isActive: true,
        roles: ['user'],
        film: {} as Film,
        checkFieldsBeforeInsert: jest.fn(),
        checkFieldsBeforeUpdate: jest.fn(),
        toJSON: jest.fn(),
      },
      {
        id: 'f215d109-b864-44d7-8009-ff0f899b5590',
        fullName: 'Jane Doe',
        username: 'janedoe',
        password:
          '$2b$10$JjwHs584TYbUqZcKWIiPxuq2EOpIieWl4X/bmlm7get4Xqr.e7mw6',
        isActive: true,
        roles: ['user'],
        film: {} as Film,
        checkFieldsBeforeInsert: jest.fn(),
        checkFieldsBeforeUpdate: jest.fn(),
        toJSON: jest.fn(),
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(mockUsers);

    const paginationDto = { limit: 2, offset: 0 };
    const result = await service.findAll(paginationDto);

    expect(repository.find).toHaveBeenCalledWith({ skip: 0, take: 2 });
    expect(result).toEqual(mockUsers);
  });

  it('Get user by ID', async () => {

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);

    const result = await service.findOne(
      '85ab41bf-322f-42bf-8f7d-7b63ee092917',
    );

    expect(repository.findOneBy).toHaveBeenCalledWith({
      id: '85ab41bf-322f-42bf-8f7d-7b63ee092917',
    });
    expect(result).toEqual(mockUser);
  });

  it('Throw NotFoundException if user is not found', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    await expect(
      service.findOne('f215d109-b864-44d7-8009-ff0f899b5590'),
    ).rejects.toThrow(NotFoundException);
    expect(repository.findOneBy).toHaveBeenCalledWith({
      id: 'f215d109-b864-44d7-8009-ff0f899b5590',
    });
  });

  it('Remove a user by ID', async () => {

    jest.spyOn(service, 'findOne').mockResolvedValue(mockUserToDelete);
    jest.spyOn(repository, 'remove').mockResolvedValue(mockUserToDelete as any);

    await service.remove('85ab41bf-322f-42bf-8f7d-7b63ee092919', mockUser);

    expect(service.findOne).toHaveBeenCalledWith(
      '85ab41bf-322f-42bf-8f7d-7b63ee092919',
    );
    expect(repository.remove).toHaveBeenCalledWith(mockUserToDelete);
  });

  it('Throw NotFoundException if user to remove is not found', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

    await expect(
      service.remove('f215d109-b864-44d7-8009-ff0f899b5590', mockUser),
    ).rejects.toThrow(NotFoundException);
    expect(service.findOne).toHaveBeenCalledWith(
      'f215d109-b864-44d7-8009-ff0f899b5590',
    );
  });
});
