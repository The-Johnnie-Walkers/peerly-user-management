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

  it('should handle null connections when discovering users', async () => {
    mockConnectionClient.getAllConnections.mockResolvedValue({ connections: null });
    const result = await useCase.discoverUsers('me');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle connections where the current user or other user is receiver/requester in different status', async () => {
    const allConnections = [
      { requesterId: 'friend-1', receiverId: 'me', status: 'ACCEPTED' },
      { requesterId: 'friend-1', receiverId: 'c1', status: 'ACCEPTED' },
      { requesterId: 'c2', receiverId: 'me', status: 'PENDING' },
    ];
    mockConnectionClient.getAllConnections.mockResolvedValue({ connections: allConnections });
    const result = await useCase.discoverUsers('me');
    expect(result.every(u => u.id !== 'c2')).toBe(true);
  });

  it('should handle null or empty interests and schedules', () => {
    const userA = makeUser({ id: 'a', interests: null, freeTimeSchedule: null, programs: null, semester: null, birthDate: null });
    const userB = makeUser({ id: 'b', interests: [], freeTimeSchedule: [], programs: [], semester: undefined, birthDate: undefined });
    const score = (useCase as any).calculateCompatibility(userA, userB, new Set(), []);
    expect(score).toBe(7);
  });

  it('should handle overlapMinutes calculation correctly when schedules exist', () => {
    const userA = makeUser({
      id: 'a',
      freeTimeSchedule: [{ dayOfTheWeek: 'MONDAY', startsAt: new Date('1970-01-01T08:00:00Z'), endsAt: new Date('1970-01-01T10:00:00Z') }]
    });
    const userB = makeUser({
      id: 'b',
      freeTimeSchedule: [{ dayOfTheWeek: 'MONDAY', startsAt: new Date('1970-01-01T09:00:00Z'), endsAt: new Date('1970-01-01T11:00:00Z') }]
    });
    const score = (useCase as any).calculateCompatibility(userA, userB, new Set(), []);
    expect(score).toBeGreaterThan(0);
  });

  it('should handle age calculation branches for birthdates in the past and future relative to current month/day', () => {
    const today = new Date();
    
    const birthdatePassed = new Date(today.getFullYear() - 20, today.getMonth() - 1, today.getDate());
    const birthdateFutureMonth = new Date(today.getFullYear() - 20, today.getMonth() + 1, today.getDate());
    
    // Avoid invalid days (e.g. today.getDate() + 2 on last day of month) by using a safe day
    const safeDay = today.getDate() > 20 ? 10 : today.getDate() + 2;
    const birthdateFutureDay = new Date(today.getFullYear() - 20, today.getMonth(), safeDay);

    // Setup dates for getAge check where today's day compared to birthdate day is tested
    // To trigger (today.getDate() < birth.getDate()), make birth.getDate() larger than today.getDate()
    let todayTest = new Date(2026, 5, 15);
    let birthPassed = new Date(2006, 4, 15); // birthday passed
    let birthFutureMonth = new Date(2006, 6, 15); // birthday in future month
    let birthFutureDay = new Date(2006, 5, 20); // birthday in same month but future day

    const agePassed = (useCase as any).getAge(birthPassed);
    const ageFutureMonth = (useCase as any).getAge(birthFutureMonth);
    const ageFutureDay = (useCase as any).getAge(birthFutureDay);

    // Let's call the helper with custom reference by temporarily mocking Date inside the test if needed, or by simple math.
    // getAge uses `new Date()` internally so we can pass hardcoded birthDates and check their results based on current year 2026.
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    const testPassed = new Date(currentYear - 20, currentMonth - 1, currentDate);
    const testFutureMonth = new Date(currentYear - 20, currentMonth + 1, currentDate);
    const testFutureDay = new Date(currentYear - 20, currentMonth, currentDate + 2);

    expect((useCase as any).getAge(testPassed)).toBe(20);
    expect((useCase as any).getAge(testFutureMonth)).toBe(19);
    expect((useCase as any).getAge(testFutureDay)).toBe(19);
  });
});
