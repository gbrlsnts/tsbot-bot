import { Configuration } from './Configuration';
import { LoaderInterface } from './LoaderInterface';
import { NatsConnector } from '../../Commands/Nats/Connector';

export class NatsLoader implements LoaderInterface {
    constructor(private readonly nats: NatsConnector) {}

    /**
     * Load a server configuration for the bot to use
     * @param name The configuration name
     */
    async loadConfiguration(name: string): Promise<Configuration> {
        const msg = await this.nats.request(
            `backend.server.${name}.config.get`
        );

        return msg.data;
    }
}
