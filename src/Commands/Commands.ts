import Manager from '../Bot/Manager';
import { NatsConnector } from './Nats/Connector';
import { CommandGateway } from './Gateway';
import { ServerMsgSubscriber } from './Subscribers/Interfaces';
import { CreateUserChannelSubscriber } from './Subscribers/CreateUserChannel';
import { DeleteUserChannelSubscriber } from './Subscribers/DeleteUserChannel';

export class Commands {
    constructor(private manager: Manager) {}

    async init(): Promise<void> {
        const nats = await new NatsConnector().connect();

        const gateway = new CommandGateway(this.manager, nats);
        gateway.subscribe(this.getServerSubscribers());

        this.manager.logger.info('Command gateway initialized');
    }

    getServerSubscribers(): ServerMsgSubscriber[] {
        return [
            new CreateUserChannelSubscriber(this.manager),
            new DeleteUserChannelSubscriber(this.manager),
        ];
    }
}
