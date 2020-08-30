import * as nats from 'nats';
import config from 'config';

const url = process.env.NATS_URL || config.get<string>('nats.url');

export class NatsConnector {
    constructor() {}

    async connect(): Promise<nats.Client> {
        const client = nats.connect({
            url,
        });

        await this.waitForConnection(client);

        return client;
    }

    private waitForConnection(client: nats.Client): Promise<void> {
        return new Promise((resolve, reject) => {
            client.on('connect', () => {
                resolve();
            });

            client.on('error', () => {
                reject();
            });
        });
    }
}
