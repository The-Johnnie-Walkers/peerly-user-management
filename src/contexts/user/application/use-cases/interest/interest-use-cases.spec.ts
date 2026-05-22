import { CreateInterestUseCaseImpl } from './create-interest-use-case.impl';
import { GetAllInterestsUseCaseImpl } from './get-all-interests-use-case.impl';
import { GetInterestUseCaseImpl } from './get-interest-use-case.impl';
import { DeleteInterestUseCaseImpl } from './delete-interest-use-case.impl';
import { UpdateInterestUseCaseImpl } from './update-interest-use-case.impl';

const mockInterest = { id: 'i1', name: 'Gaming', category: 'VIDEOGAMES' } as any;

describe('Interest Use Cases', () => {
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockResolvedValue(mockInterest),
      findAll: jest.fn().mockResolvedValue([mockInterest]),
      findById: jest.fn().mockResolvedValue(mockInterest),
      deleteById: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(mockInterest),
    };
  });

  describe('CreateInterestUseCaseImpl', () => {
    it('should save and return interest', async () => {
      const useCase = new CreateInterestUseCaseImpl(mockRepo);
      const result = await useCase.createInterest(mockInterest);
      expect(result).toBe(mockInterest);
      expect(mockRepo.save).toHaveBeenCalledWith(mockInterest);
    });
  });

  describe('GetAllInterestsUseCaseImpl', () => {
    it('should return all interests', async () => {
      const useCase = new GetAllInterestsUseCaseImpl(mockRepo);
      const result = await useCase.getAllInterests();
      expect(result).toHaveLength(1);
    });

    it('should return empty array when none', async () => {
      mockRepo.findAll.mockResolvedValue([]);
      const useCase = new GetAllInterestsUseCaseImpl(mockRepo);
      const result = await useCase.getAllInterests();
      expect(result).toEqual([]);
    });
  });

  describe('GetInterestUseCaseImpl', () => {
    it('should return interest by id', async () => {
      const useCase = new GetInterestUseCaseImpl(mockRepo);
      const result = await useCase.getInterestById('i1');
      expect(result).toBe(mockInterest);
    });

    it('should propagate error if not found', async () => {
      mockRepo.findById.mockRejectedValue(new Error('Not found'));
      const useCase = new GetInterestUseCaseImpl(mockRepo);
      await expect(useCase.getInterestById('bad')).rejects.toThrow('Not found');
    });
  });

  describe('DeleteInterestUseCaseImpl', () => {
    it('should delete interest by id', async () => {
      const useCase = new DeleteInterestUseCaseImpl(mockRepo);
      await useCase.deleteInterestById('i1');
      expect(mockRepo.deleteById).toHaveBeenCalledWith('i1');
    });
  });

  describe('UpdateInterestUseCaseImpl', () => {
    it('should update and return interest', async () => {
      const useCase = new UpdateInterestUseCaseImpl(mockRepo);
      const result = await useCase.updateInterest('i1', mockInterest);
      expect(result).toBe(mockInterest);
      expect(mockRepo.update).toHaveBeenCalledWith('i1', mockInterest);
    });
  });
});
