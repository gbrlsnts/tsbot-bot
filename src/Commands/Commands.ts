import Manager from '../Bot/Manager';
import { NatsConnector } from './Nats/Connector';
import { CommandGateway } from './Gateway';

export class Commands {
    constructor(private manager: Manager) {}

    async init(): Promise<void> {
        const nats = await new NatsConnector().connect();

        const gateway = new CommandGateway(this.manager, nats);
        gateway.subscribe();

        this.manager.logger.info('Command gateway initialized');
    }
}
