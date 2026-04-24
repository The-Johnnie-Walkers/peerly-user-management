import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ConnectionMessagingClientService } from '../../../out/messaging/connection-messaging-client.service';

@Controller('communities')
export class CommunityController {
    constructor(private readonly connectionClient: ConnectionMessagingClientService) {}

    @Post()
    create(@Body() body: { name: string; description: string; interests: string[]; creatorId: string }) {
        return this.connectionClient.createCommunity(body);
    }

    @Get()
    getAll() {
        return this.connectionClient.getAllCommunities();
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.connectionClient.getCommunityById(id);
    }

    @Post(':id/join')
    join(@Param('id') communityId: string, @Body() body: { userId: string }) {
        return this.connectionClient.joinCommunity({ communityId, userId: body.userId });
    }

    @Post(':id/leave')
    leave(@Param('id') communityId: string, @Body() body: { userId: string }) {
        return this.connectionClient.leaveCommunity({ communityId, userId: body.userId });
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.connectionClient.deleteCommunity({ communityId: id });
    }
}