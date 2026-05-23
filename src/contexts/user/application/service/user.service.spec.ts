import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  id: 'u1',
  name: 'Test',
  email: 'test@mail.com',
  validateAge: jest.fn(),
} as any;

describe('UserService', () => {
  let service: UserService;
  let mockCreate: any;
  let mockUpdate: any;
  let mockDelete: any;
  let mockGet: any;
  let mockGetAll: any;
  let mockDiscover: any;

  beforeEach(() => {
    mockCreate = { createUser: jest.fn().mockResolvedValue(mockUser) };
    mockUpdate = { updateUser: jest.fn().mockResolvedValue(mockUser) };
    mockDelete = { deleteUserById: jest.fn().mockResolvedValue(undefined) };
    mockGet = { getUserById: jest.fn().mockResolvedValue(mockUser) };
    mockGetAll = { getAllUsers: jest.fn().mockResolvedValue([mockUser]) };
    mockDiscover = { discoverUsers: jest.fn().mockResolvedValue([mockUser]) };

    service = new UserService(
      mockCreate, mockUpdate, mockDelete, mockGet, mockGetAll, mockDiscover,
    );
  });

  it('should create user after validating age', async () => {
    const result = await service.createUser(mockUser);
    expect(mockUser.validateAge).toHaveBeenCalled();
    expect(result).toBe(mockUser);
  });

  it('should update user after validating age', async () => {
    const result = await service.updateUser('u1', mockUser);
    expect(mockUser.validateAge).toHaveBeenCalled();
    expect(result).toBe(mockUser);
  });

  it('should delete user by id', async () => {
    await service.deleteUserById('u1');
    expect(mockDelete.deleteUserById).toHaveBeenCalledWith('u1');
  });

  it('should get user by id', async () => {
    const result = await service.getUserById('u1');
    expect(result).toBe(mockUser);
  });

  it('should get all users', async () => {
    const result = await service.getAllUsers();
    expect(result).toHaveLength(1);
  });

  it('should discover users', async () => {
    const result = await service.discoverUsers('u1');
    expect(result).toHaveLength(1);
    expect(mockDiscover.discoverUsers).toHaveBeenCalledWith('u1');
  });

  it('should throw if validateAge fails on create', async () => {
    mockUser.validateAge.mockImplementationOnce(() => { throw new Error('Too young'); });
    await expect(service.createUser(mockUser)).rejects.toThrow('Too young');
  });
});
