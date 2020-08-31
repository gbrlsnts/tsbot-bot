import Manager from '../Bot/Manager';
import { NatsConnector } from './Nats/Connector';
import { CommandGateway } from './Gateway';
import { SubscriberInterface } from './Subscribers/SubscriberInterface';
import { CreateUserChannelSubscriber } from './Subscribers/CreateUserChannel';
import { DeleteUserChannelSubscriber } from './Subscribers/DeleteUserChannel';

export class Commands {
    constructor(private manager: Manager) {}

    async init(): Promise<void> {
        const nats = await new NatsConnector().connect();

        const gateway = new CommandGateway(this.manager, nats);
        gateway.subscribe(this.getSubscribers());

        this.manager.logger.info('Command gateway initialized');
    }

    getSubscribers(): SubscriberInterface[] {
        return [
            new CreateUserChannelSubscriber(this.manager),
            new DeleteUserChannelSubscriber(this.manager),
        ];
    }
}
