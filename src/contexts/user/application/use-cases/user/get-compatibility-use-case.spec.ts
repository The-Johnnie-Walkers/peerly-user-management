import { GetCompatibilityUseCaseImpl } from './get-compatibility-use-case.impl';

const mockUser = { id: 'u1', name: 'Test', interests: [], programs: [], semester: 5, birthDate: new Date('2000-01-01'), freeTimeSchedule: [] } as any;

describe('GetCompatibilityUseCaseImpl', () => {
  let useCase: GetCompatibilityUseCaseImpl;
  let mockRepo: any;
  let mockConnectionClient: any;
  let mockDiscoverUseCase: any;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockUser),
    };
    mockConnectionClient = {
      getAllConnections: jest.fn().mockResolvedValue({ connections: [] }),
    };
    mockDiscoverUseCase = {
      calculateCompatibility: jest.fn().mockReturnValue(85),
    };
    useCase = new GetCompatibilityUseCaseImpl(mockRepo, mockConnectionClient, mockDiscoverUseCase);
  });

  it('should return compatibility score between two users', async () => {
    const score = await useCase.getCompatibility('u1', 'u2');
    expect(score).toBe(85);
    expect(mockRepo.findById).toHaveBeenCalledWith('u1');
    expect(mockRepo.findById).toHaveBeenCalledWith('u2');
    expect(mockDiscoverUseCase.calculateCompatibility).toHaveBeenCalled();
  });

  it('should filter ACCEPTED connections for mutual friends', async () => {
    mockConnectionClient.getAllConnections.mockResolvedValue({
      connections: [
        { requesterId: 'u1', receiverId: 'friend-1', status: 'ACCEPTED' },
        { requesterId: 'u1', receiverId: 'friend-2', status: 'PENDING' },
      ],
    });
    await useCase.getCompatibility('u1', 'u2');
    const callArgs = mockDiscoverUseCase.calculateCompatibility.mock.calls[0];
    const myFriendIds: Set<string> = callArgs[2];
    expect(myFriendIds.has('friend-1')).toBe(true);
    expect(myFriendIds.has('friend-2')).toBe(false);
  });

  it('should handle empty connections', async () => {
    mockConnectionClient.getAllConnections.mockResolvedValue({ connections: null });
    const score = await useCase.getCompatibility('u1', 'u2');
    expect(score).toBe(85);
  });

  it('should handle connections where user is receiver', async () => {
    mockConnectionClient.getAllConnections.mockResolvedValue({
      connections: [{ requesterId: 'friend-1', receiverId: 'u1', status: 'ACCEPTED' }],
    });
    await useCase.getCompatibility('u1', 'u2');
    const callArgs = mockDiscoverUseCase.calculateCompatibility.mock.calls[0];
    const myFriendIds: Set<string> = callArgs[2];
    expect(myFriendIds.has('friend-1')).toBe(true);
  });
});
