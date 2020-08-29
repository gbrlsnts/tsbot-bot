import { Client } from 'nats';
import Manager from '../Bot/Manager';
import { CreateUserChannelHandler } from './Handlers/CreateUserChannel';

export class CommandGateway {
  constructor(private manager: Manager, private nats: Client) {}

  async subscribe(): Promise<void> {
    const handler = new CreateUserChannelHandler(this.manager);

    this.nats.subscribe(handler.getSubject(), handler.handle);
  }
}
