import { CreateUserUseCaseImpl } from './create-user-use-case.impl';
import { GetUserUseCaseImpl } from './get-user-use-case.impl';
import { UpdateUserUseCaseImpl } from './update-user-use-case.impl';
import { DeleteUserUseCaseImpl } from './delete-user-use-case.impl';
import { GetAllUsersUseCaseImpl } from './get-all-users-use-case.impl';

const mockUser = { id: 'u1', name: 'Test', email: 'test@mail.com' } as any;

describe('User Use Cases', () => {
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockResolvedValue(mockUser),
      findById: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
      deleteById: jest.fn().mockResolvedValue(undefined),
      findAll: jest.fn().mockResolvedValue([mockUser]),
    };
  });

  describe('CreateUserUseCaseImpl', () => {
    it('should save and return user', async () => {
      const useCase = new CreateUserUseCaseImpl(mockRepo);
      const result = await useCase.createUser(mockUser);
      expect(result).toBe(mockUser);
      expect(mockRepo.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('GetUserUseCaseImpl', () => {
    it('should return user by id', async () => {
      const useCase = new GetUserUseCaseImpl(mockRepo);
      const result = await useCase.getUserById('u1');
      expect(result).toBe(mockUser);
      expect(mockRepo.findById).toHaveBeenCalledWith('u1');
    });

    it('should propagate error if not found', async () => {
      mockRepo.findById.mockRejectedValue(new Error('Not found'));
      const useCase = new GetUserUseCaseImpl(mockRepo);
      await expect(useCase.getUserById('bad')).rejects.toThrow('Not found');
    });
  });

  describe('UpdateUserUseCaseImpl', () => {
    it('should update and return user', async () => {
      const useCase = new UpdateUserUseCaseImpl(mockRepo);
      const result = await useCase.updateUser('u1', mockUser);
      expect(result).toBe(mockUser);
      expect(mockRepo.update).toHaveBeenCalledWith('u1', mockUser);
    });
  });

  describe('DeleteUserUseCaseImpl', () => {
    it('should delete user by id', async () => {
      const useCase = new DeleteUserUseCaseImpl(mockRepo);
      await useCase.deleteUserById('u1');
      expect(mockRepo.deleteById).toHaveBeenCalledWith('u1');
    });
  });

  describe('GetAllUsersUseCaseImpl', () => {
    it('should return all users', async () => {
      const useCase = new GetAllUsersUseCaseImpl(mockRepo);
      const result = await useCase.getAllUsers();
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockUser);
    });

    it('should return empty array when no users', async () => {
      mockRepo.findAll.mockResolvedValue([]);
      const useCase = new GetAllUsersUseCaseImpl(mockRepo);
      const result = await useCase.getAllUsers();
      expect(result).toEqual([]);
    });
  });
});
