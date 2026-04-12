import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ConnectionMessagingClientService } from '../../../out/messaging/connection-messaging-client.service';

@Controller('connections')
export class ConnectionController {
    constructor(private readonly connectionClient: ConnectionMessagingClientService) {}

    @Post()
    create(@Body() body: { requesterId: string; receiverId: string }) {
        return this.connectionClient.createConnection(body);
    }

    @Get()
    getAll() {
        return this.connectionClient.getAllConnections();
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.connectionClient.getConnectionById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: { status: string }) {
        return this.connectionClient.updateConnection({ connectionId: id, status: body.status as any });
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.connectionClient.deleteConnection({ connectionId: id });
    }
}