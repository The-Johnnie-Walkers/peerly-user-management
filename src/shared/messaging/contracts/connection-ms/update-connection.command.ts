import { ConnectionStatus } from '../../../enums/connection-status.enum';

export interface UpdateConnectionCommand {
  connectionId: string;
  status: ConnectionStatus;
}