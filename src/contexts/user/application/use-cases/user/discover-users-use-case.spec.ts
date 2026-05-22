import { DiscoverUsersUseCaseImpl } from './discover-users-use-case.impl';

const makeUser = (overrides: any = {}) => ({
  id: 'u1',
  name: 'Test',
  email: 'test@mail.com',
  semester: 5,
  birthDate: new Date('2000-01-01'),
  programs: ['SYSTEMS_ENGINEERING'],
  interests: [{ id: 'i1' }, { id: 'i2' }],
  freeTimeSchedule: [
    { dayOfTheWeek: 'MONDAY', startsAt: new Date('1970-01-01T08:00:00Z'), endsAt: new Date('1970-01-01T10:00:00Z') },
  ],
  ...overrides,
});

describe('DiscoverUsersUseCaseImpl', () => {
  let useCase: DiscoverUsersUseCaseImpl;
  let mockRepo: any;
  let mockConnectionClient: any;

  const me = makeUser({ id: 'me' });
  const candidate1 = makeUser({ id: 'c1', interests: [{ id: 'i1' }, { id: 'i2' }] });
  const candidate2 = makeUser({ id: 'c2', interests: [{ id: 'i3' }], programs: ['CIVIL_ENGINEERING'] });

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(me),
      findAll: jest.fn().mockResolvedValue([me, candidate1, candidate2]),
    };
    mockConnectionClient = {
      getAllConnections: jest.fn().mockResolvedValue({ connections: [] }),
    };
    useCase = new DiscoverUsersUseCaseImpl(mockRepo, mockConnectionClient);
  });

  it('should exclude the requesting user from results', async () => {
    const result = await useCase.discoverUsers('me');
    expect(result.every(u => u.id !== 'me')).toBe(true);
  });

  it('should exclude users with existing connections', async () => {
    mockConnectionClient.getAllConnections.mockResolvedValue({
      connections: [{ requesterId: 'me', receiverId: 'c1', status: 'PENDING' }],
    });
    const result = await useCase.discoverUsers('me');
    expect(result.every(u => u.id !== 'c1')).toBe(true);
  });

  it('should return candidates sorted by compatibility descending', async () => {
    const result = await useCase.discoverUsers('me');
    expect(result.length).toBeGreaterThan(0);
    // candidate1 shares more interests → should rank higher
    if (result.length >= 2) {
      const idx1 = result.findIndex(u => u.id === 'c1');
      const idx2 = result.findIndex(u => u.id === 'c2');
      expect(idx1).toBeLessThan(idx2);
    }
  });

  it('should return empty array when all users are connected', async () => {
    mockConnectionClient.getAllConnections.mockResolvedValue({
      connections: [
        { requesterId: 'me', receiverId: 'c1', status: 'ACCEPTED' },
        { requesterId: 'me', receiverId: 'c2', status: 'PENDING' },
      ],
    });
    const result = await useCase.discoverUsers('me');
    expect(result).toHaveLength(0);
  });

  it('calculateCompatibility should return 0-100 range', () => {
    const myFriendIds = new Set<string>();
    const allConnections: any[] = [];
    const score = (useCase as any).calculateCompatibility(me, candidate1, myFriendIds, allConnections);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should give higher score to users with same program', () => {
    const sameProgram = makeUser({ id: 'same', programs: ['SYSTEMS_ENGINEERING'], interests: [] });
    const diffProgram = makeUser({ id: 'diff', programs: ['CIVIL_ENGINEERING'], interests: [] });
    const myFriendIds = new Set<string>();
    const allConnections: any[] = [];
    const scoreSame = (useCase as any).calculateCompatibility(me, sameProgram, myFriendIds, allConnections);
    const scoreDiff = (useCase as any).calculateCompatibility(me, diffProgram, myFriendIds, allConnections);
    expect(scoreSame).toBeGreaterThan(scoreDiff);
  });

  it('should give higher score to users with overlapping availability', () => {
    const withOverlap = makeUser({
      id: 'overlap',
      freeTimeSchedule: [
        { dayOfTheWeek: 'MONDAY', startsAt: new Date('1970-01-01T08:00:00Z'), endsAt: new Date('1970-01-01T10:00:00Z') },
      ],
    });
    const noOverlap = makeUser({
      id: 'nooverlap',
      freeTimeSchedule: [
        { dayOfTheWeek: 'FRIDAY', startsAt: new Date('1970-01-01T14:00:00Z'), endsAt: new Date('1970-01-01T16:00:00Z') },
      ],
    });
    const myFriendIds = new Set<string>();
    const allConnections: any[] = [];
    const scoreOverlap = (useCase as any).calculateCompatibility(me, withOverlap, myFriendIds, allConnections);
    const scoreNoOverlap = (useCase as any).calculateCompatibility(me, noOverlap, myFriendIds, allConnections);
    expect(scoreOverlap).toBeGreaterThan(scoreNoOverlap);
  });

  it('should account for mutual friends in score', () => {
    const allConnections = [
      { requesterId: 'me', receiverId: 'friend-1', status: 'ACCEPTED' },
      { requesterId: 'c1', receiverId: 'friend-1', status: 'ACCEPTED' },
    ];
    const myFriendIds = new Set(['friend-1']);
    const scoreWithMutual = (useCase as any).calculateCompatibility(me, candidate1, myFriendIds, allConnections);
    const scoreWithout = (useCase as any).calculateCompatibility(me, candidate1, new Set(), []);
    expect(scoreWithMutual).toBeGreaterThanOrEqual(scoreWithout);
  });
});
