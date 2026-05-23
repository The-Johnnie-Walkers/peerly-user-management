import { ActivityController } from './activity.controller';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('ActivityController', () => {
  let controller: ActivityController;
  let mockMessagingClient: any;
  let mockUserModel: any;

  beforeEach(() => {
    mockMessagingClient = {
      createActivity: jest.fn().mockResolvedValue({ success: true, activityId: 'a1' }),
      updateActivity: jest.fn().mockResolvedValue({ success: true }),
      deleteActivity: jest.fn().mockResolvedValue({ success: true }),
      getActivityById: jest.fn().mockResolvedValue({ success: true, activity: {} }),
      getAllActivities: jest.fn().mockResolvedValue({ success: true, activities: [] }),
      reserveSlot: jest.fn().mockResolvedValue({ success: true }),
      releaseSlot: jest.fn().mockResolvedValue({ success: true }),
    };

    mockUserModel = {
      findById: jest.fn().mockReturnThis(),
      findByIdAndUpdate: jest.fn().mockReturnThis(),
      updateMany: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({ _id: 'u1', joinedActivityIds: ['a1'] }),
    };

    controller = new ActivityController(mockMessagingClient, mockUserModel);
  });

  describe('getJoinedActivities', () => {
    it('should return joined activities for a user', async () => {
      mockUserModel.exec.mockResolvedValue({ _id: 'u1', joinedActivityIds: ['a1'] });
      mockMessagingClient.getActivityById.mockResolvedValue({ success: true });
      const result = await controller.getJoinedActivities('u1');
      expect(result.userId).toBe('u1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.exec.mockResolvedValue(null);
      await expect(controller.getJoinedActivities('bad')).rejects.toThrow(NotFoundException);
    });

    it('should handle empty joinedActivityIds', async () => {
      mockUserModel.exec.mockResolvedValue({ _id: 'u1', joinedActivityIds: [] });
      const result = await controller.getJoinedActivities('u1');
      expect(result.activityIds).toEqual([]);
    });

    it('should remove stale activity ids', async () => {
      mockUserModel.exec.mockResolvedValue({ _id: 'u1', joinedActivityIds: ['a1', 'a2'] });
      mockMessagingClient.getActivityById
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false });
      const result = await controller.getJoinedActivities('u1');
      expect(result.activityIds).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should create activity and update user', async () => {
      const dto = {
        requesterUserId: 'u1', name: 'Test', description: 'Desc',
        startsAt: new Date(), endsAt: new Date(), status: 'OPEN' as any,
        location: {} as any, totalPlaces: 10,
      };
      const result = await controller.create(dto as any);
      expect(result.success).toBe(true);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should not update user if activity creation fails', async () => {
      mockMessagingClient.createActivity.mockResolvedValue({ success: false });
      const dto = { requesterUserId: 'u1', name: 'Test' } as any;
      await controller.create(dto);
      expect(mockUserModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update activity', async () => {
      const result = await controller.update('a1', {} as any);
      expect(mockMessagingClient.updateActivity).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete activity and clean up user references', async () => {
      await controller.delete('a1');
      expect(mockMessagingClient.deleteActivity).toHaveBeenCalledWith({ activityId: 'a1' });
      expect(mockUserModel.updateMany).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if delete fails', async () => {
      mockMessagingClient.deleteActivity.mockResolvedValue({ success: false, message: 'Error' });
      await expect(controller.delete('a1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getById', () => {
    it('should return activity by id', async () => {
      const result = await controller.getById('a1');
      expect(mockMessagingClient.getActivityById).toHaveBeenCalledWith('a1');
    });
  });

  describe('getAll', () => {
    it('should return all activities', async () => {
      const result = await controller.getAll();
      expect(mockMessagingClient.getAllActivities).toHaveBeenCalled();
    });
  });

  describe('join', () => {
    it('should join activity and update user', async () => {
      mockUserModel.exec.mockResolvedValue({ _id: 'u1' }); // assertUserExists
      const result = await controller.join('a1', 'u1');
      expect(mockMessagingClient.reserveSlot).toHaveBeenCalledWith({ activityId: 'a1', userId: 'u1' });
    });

    it('should throw NotFoundException if user not found on join', async () => {
      mockUserModel.exec.mockResolvedValue(null);
      await expect(controller.join('a1', 'bad')).rejects.toThrow(NotFoundException);
    });

    it('should not update user if reservation fails', async () => {
      mockUserModel.exec.mockResolvedValue({ _id: 'u1' });
      mockMessagingClient.reserveSlot.mockResolvedValue({ success: false });
      await controller.join('a1', 'u1');
      expect(mockUserModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('leave', () => {
    it('should leave activity and update user', async () => {
      mockUserModel.exec.mockResolvedValue({ _id: 'u1' });
      await controller.leave('a1', 'u1');
      expect(mockMessagingClient.releaseSlot).toHaveBeenCalledWith({ activityId: 'a1', userId: 'u1' });
    });

    it('should throw NotFoundException if user not found on leave', async () => {
      mockUserModel.exec.mockResolvedValue(null);
      await expect(controller.leave('a1', 'bad')).rejects.toThrow(NotFoundException);
    });
  });
});
