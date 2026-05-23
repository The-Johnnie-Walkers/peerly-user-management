import { InterestService } from './interest.service';

const mockInterest = { id: 'i1', name: 'Gaming', category: 'VIDEOGAMES' } as any;

describe('InterestService', () => {
  let service: InterestService;
  let mockCreate: any;
  let mockUpdate: any;
  let mockDelete: any;
  let mockGet: any;
  let mockGetAll: any;

  beforeEach(() => {
    mockCreate = { createInterest: jest.fn().mockResolvedValue(mockInterest) };
    mockUpdate = { updateInterest: jest.fn().mockResolvedValue(mockInterest) };
    mockDelete = { deleteInterestById: jest.fn().mockResolvedValue(undefined) };
    mockGet = { getInterestById: jest.fn().mockResolvedValue(mockInterest) };
    mockGetAll = { getAllInterests: jest.fn().mockResolvedValue([mockInterest]) };

    service = new InterestService(mockCreate, mockUpdate, mockDelete, mockGet, mockGetAll);
  });

  it('should create interest', async () => {
    const result = await service.createInterest(mockInterest);
    expect(result).toBe(mockInterest);
    expect(mockCreate.createInterest).toHaveBeenCalledWith(mockInterest);
  });

  it('should update interest', async () => {
    const result = await service.updateInterest('i1', mockInterest);
    expect(result).toBe(mockInterest);
    expect(mockUpdate.updateInterest).toHaveBeenCalledWith('i1', mockInterest);
  });

  it('should delete interest', async () => {
    await service.deleteInterestById('i1');
    expect(mockDelete.deleteInterestById).toHaveBeenCalledWith('i1');
  });

  it('should get interest by id', async () => {
    const result = await service.getInterestById('i1');
    expect(result).toBe(mockInterest);
  });

  it('should get all interests', async () => {
    const result = await service.getAllInterests();
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no interests', async () => {
    mockGetAll.getAllInterests.mockResolvedValue([]);
    const result = await service.getAllInterests();
    expect(result).toEqual([]);
  });
});
