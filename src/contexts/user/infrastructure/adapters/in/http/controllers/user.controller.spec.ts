import { UserController } from './user.controller';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 'u1', name: 'Test', email: 'test@mail.com' } as any;
const mockUserDto = { id: 'u1', name: 'Test', email: 'test@mail.com' } as any;

describe('UserController', () => {
  let controller: UserController;
  let mockService: any;
  let mockMapper: any;
  let mockRepo: any;
  let mockDiscover: any;
  let mockConnectionClient: any;

  beforeEach(() => {
    mockService = {
      createUser: jest.fn().mockResolvedValue(mockUser),
      updateUser: jest.fn().mockResolvedValue(mockUser),
      deleteUserById: jest.fn().mockResolvedValue(undefined),
      getUserById: jest.fn().mockResolvedValue(mockUser),
      getAllUsers: jest.fn().mockResolvedValue([mockUser]),
      discoverUsers: jest.fn().mockResolvedValue([mockUser]),
    };
    mockMapper = {
      toDomain: jest.fn().mockReturnValue(mockUser),
      toResponse: jest.fn().mockReturnValue(mockUserDto),
      toResponseList: jest.fn().mockReturnValue([mockUserDto]),
    };
    mockRepo = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      findById: jest.fn().mockResolvedValue(mockUser),
    };
    const mockAvatarStorage = { save: jest.fn().mockResolvedValue('http://img.url/avatar.png') };
    mockDiscover = {
      calculateCompatibility: jest.fn().mockReturnValue(85),
    };
    mockConnectionClient = {
      getAllConnections: jest.fn().mockResolvedValue({ connections: [] }),
    };
    controller = new UserController(
      mockService, mockMapper, mockRepo, mockAvatarStorage as any,
      mockDiscover, mockConnectionClient,
    );
  });

  it('should create user', async () => {
    const result = await controller.createUser({} as any);
    expect(mockService.createUser).toHaveBeenCalled();
    expect(result).toBe(mockUserDto);
  });

  it('should update user with multipart form data', async () => {
    const mockReq = { headers: { 'content-type': 'multipart/form-data; boundary=xxx' } } as any;
    const validBody = {
      username: 'testuser', name: 'Test', lastname: 'User',
      email: 'test@mail.com', birthDate: new Date('2000-01-01'),
      semester: 5, status: 'ACTIVE', programs: ['SYSTEMS_ENGINEERING'], role: 'USER',
    };
    const dataField = JSON.stringify(validBody);
    const result = await controller.updateUser('u1', mockReq, undefined, { data: dataField } as any);
    expect(mockService.updateUser).toHaveBeenCalled();
    expect(result).toBe(mockUserDto);
  });

  it('should throw BadRequestException if data field is missing in multipart', async () => {
    const mockReq = { headers: { 'content-type': 'multipart/form-data' } } as any;
    await expect(controller.updateUser('u1', mockReq, undefined, {} as any))
      .rejects.toThrow();
  });

  it('should throw BadRequestException if data field is invalid JSON in multipart', async () => {
    const mockReq = { headers: { 'content-type': 'multipart/form-data' } } as any;
    await expect(controller.updateUser('u1', mockReq, undefined, { data: 'not-json' } as any))
      .rejects.toThrow();
  });

  it('should update user with multipart form data and avatar', async () => {
    const mockReq = { headers: { 'content-type': 'multipart/form-data; boundary=xxx' } } as any;
    const validBody = {
      username: 'testuser', name: 'Test', lastname: 'User',
      email: 'test@mail.com', birthDate: new Date('2000-01-01'),
      semester: 5, status: 'ACTIVE', programs: ['SYSTEMS_ENGINEERING'], role: 'USER',
    };
    const dataField = JSON.stringify(validBody);
    const mockAvatar = { buffer: Buffer.from('abc'), originalname: 'avatar.png' } as any;
    const result = await controller.updateUser('u1', mockReq, mockAvatar, { data: dataField } as any);
    expect(mockService.updateUser).toHaveBeenCalled();
    expect(result).toBe(mockUserDto);
  });

  it('should throw BadRequestException if request validation fails', async () => {
    const mockReq = { headers: { 'content-type': 'application/json' } } as any;
    const invalidBody = {
      username: '',
      name: 'Test',
      lastname: 'User',
      email: 'invalid-email',
      birthDate: new Date('2000-01-01'),
      semester: 'not-a-number',
      status: 'ACTIVE',
      programs: ['SYSTEMS_ENGINEERING'],
      role: 'USER',
    };
    await expect(controller.updateUser('u1', mockReq, undefined, invalidBody as any))
      .rejects.toThrow();
  });

  it('should normalize interests correctly', async () => {
    const mockReq = { headers: { 'content-type': 'application/json' } } as any;
    const validBody = {
      username: 'testuser',
      name: 'Test',
      lastname: 'User',
      email: 'test@mail.com',
      birthDate: new Date('2000-01-01'),
      semester: 5,
      status: 'ACTIVE',
      programs: ['SYSTEMS_ENGINEERING'],
      role: 'USER',
      interests: ['interest-1', '', null, { id: 'interest-2' }, { id: '' }, {}],
    };
    const result = await controller.updateUser('u1', mockReq, undefined, validBody as any);
    expect(mockService.updateUser).toHaveBeenCalled();
    expect(result).toBe(mockUserDto);
  });
  it('should update user without multipart', async () => {
    const mockReq = { headers: { 'content-type': 'application/json' } } as any;
    const validBody = {
      username: 'testuser',
      name: 'Test',
      lastname: 'User',
      email: 'test@mail.com',
      birthDate: new Date('2000-01-01'),
      semester: 5,
      status: 'ACTIVE',
      programs: ['SYSTEMS_ENGINEERING'],
      role: 'USER',
    };
    const result = await controller.updateUser('u1', mockReq, undefined, validBody as any);
    expect(mockService.updateUser).toHaveBeenCalledWith('u1', mockUser);
    expect(result).toBe(mockUserDto);
  });

  it('should delete user', async () => {
    await controller.deleteUser('u1');
    expect(mockService.deleteUserById).toHaveBeenCalledWith('u1');
  });

  it('should get user by email', async () => {
    const result = await controller.getUserByEmail('test@mail.com');
    expect(result).toBe(mockUserDto);
  });

  it('should throw NotFoundException if user not found by email', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    await expect(controller.getUserByEmail('noexist@mail.com')).rejects.toThrow(NotFoundException);
  });

  it('should get user by id', async () => {
    const result = await controller.getUserById('u1');
    expect(result).toBe(mockUserDto);
  });

  it('should get all users', async () => {
    const result = await controller.getAllUsers();
    expect(result).toHaveLength(1);
  });

  it('should discover users', async () => {
    const result = await controller.discoverUsers('u1');
    expect(result).toHaveLength(1);
  });

  it('should get compatibility score', async () => {
    const result = await controller.getCompatibility('u1', 'u2');
    expect(result).toHaveProperty('score');
    expect(typeof result.score).toBe('number');
  });

  it('should return score 0 if user not found in compatibility', async () => {
    mockRepo.findById.mockResolvedValue(null);
    const result = await controller.getCompatibility('u1', 'bad');
    expect(result.score).toBe(0);
  });

  it('should update presence to online', async () => {
    mockRepo.findById.mockResolvedValue({ ...mockUser, isOnline: false, lastTimeConnected: null });
    mockService.updateUser.mockResolvedValue(mockUser);
    await controller.updatePresence('u1', { isOnline: true });
    expect(mockService.updateUser).toHaveBeenCalled();
  });

  it('should throw NotFoundException on updatePresence if user not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(controller.updatePresence('bad', { isOnline: true })).rejects.toThrow(NotFoundException);
  });

  it('should update presence to offline', async () => {
    mockRepo.findById.mockResolvedValue({ ...mockUser, isOnline: true, lastTimeConnected: new Date() });
    mockService.updateUser.mockResolvedValue(mockUser);
    await controller.updatePresence('u1', { isOnline: false });
    expect(mockService.updateUser).toHaveBeenCalled();
  });
});
