import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/user/entities/user.entity';
import { UserService } from '../../src/user/user.service';

import { Repository } from 'typeorm';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Create a new user successfully', async () => {
    const createUserDto = { name: 'John Doe', username: 'john123', password: 'password' };
    const user = { id: '85ab41bf-322f-42bf-8f7d-7b63ee092917', ...createUserDto };
  
    mockRepository.create.mockReturnValue(user);
    mockRepository.save.mockResolvedValue(user);
  
    const result = await service.create(createUserDto);
  
    expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(mockRepository.save).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it('Handle exceptions', async () => {
    const createUserDto = { name: 'John Doe', username: 'johndoe', email: 'john.doe@example.com', password: 'Password@123' };
    const error = { code: '23505', detail: 'Duplicate entry' };
  
    jest.spyOn(repository, 'create').mockImplementation(() => {
      throw error;
    });
  
    jest.spyOn(service as any, 'handleDBExceptions').mockImplementation((err: any) => {
      if (err.code === '23505') {
        throw new BadRequestException(err.detail);
      }
      throw new InternalServerErrorException('Unexpected error occurred, check the logs for details');
    });
  
    await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    expect(service['handleDBExceptions']).toHaveBeenCalledWith(error);
  });

  it('Get all users', async () => {
    const mockUsers = [
      { id: '85ab41bf-322f-42bf-8f7d-7b63ee092917', name: 'John Doe', username: 'johndoe', email: 'john.doe@example.com', password: 'Password@123' },
      { id: 'f215d109-b864-44d7-8009-ff0f899b5590', name: 'Jane Doe', username: 'janedoe', email: 'jane.doe@example.com', password: 'Password@123' },
    ];
  
    jest.spyOn(repository, 'find').mockResolvedValue(mockUsers);
  
    const paginationDto = { limit: 2, offset: 0 };
    const result = await service.findAll(paginationDto);
  
    expect(repository.find).toHaveBeenCalledWith({ skip: 0, take: 2 });
    expect(result).toEqual(mockUsers);
  });

  it('Get user by ID', async () => {
    const mockUser = { id: 'f215d109-b864-44d7-8009-ff0f899b5590', name: 'John Doe', username: 'johndoe', email: 'john.doe@example.com', password: 'Password@123' };
  
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);
  
    const result = await service.findOne('f215d109-b864-44d7-8009-ff0f899b5590');
  
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'f215d109-b864-44d7-8009-ff0f899b5590' });
    expect(result).toEqual(mockUser);
  });
  
  it('Throw NotFoundException if user is not found', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
  
    await expect(service.findOne('f215d109-b864-44d7-8009-ff0f899b5590')).rejects.toThrow(NotFoundException);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'f215d109-b864-44d7-8009-ff0f899b5590' });
  });
  
  it('Remove a user by ID', async () => {
    const mockUser = { id: 'f215d109-b864-44d7-8009-ff0f899b5590', name: 'John Doe', username: 'johndoe', email: 'john.doe@example.com', password: 'Password@123' };
  
    jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(repository, 'remove').mockResolvedValue(mockUser as any);
  
    await service.remove('f215d109-b864-44d7-8009-ff0f899b5590');
  
    expect(service.findOne).toHaveBeenCalledWith('f215d109-b864-44d7-8009-ff0f899b5590');
    expect(repository.remove).toHaveBeenCalledWith(mockUser);
  });
  
  
  
  it('Throw NotFoundException if user to remove is not found', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
  
    await expect(service.remove('f215d109-b864-44d7-8009-ff0f899b5590')).rejects.toThrow(NotFoundException);
    expect(service.findOne).toHaveBeenCalledWith('f215d109-b864-44d7-8009-ff0f899b5590');
  });
  
});
