import * as nats from 'nats';
import config from 'config';
import { requestConfig } from './Configs';

const url = process.env.NATS_URL || config.get<string>('nats.url');

export class NatsConnector {
    private client?: nats.Client;

    constructor() {}

    async connect(): Promise<nats.Client> {
        const client = nats.connect({
            url,
            payload: nats.Payload.JSON,
        });

        await this.waitForConnection(client);

        this.client = client;

        return client;
    }

    getClient(): nats.Client {
        if (!this.client) throw new Error('client not initialized');

        return this.client;
    }

    async request(subject: string, data?: any): Promise<nats.Msg> {
        return new Promise((resolve, reject) => {
            if (!this.client) return reject('client not initialized');

            this.client.request(
                subject,
                (err, msg) => {
                    if (err) return reject(err);

                    try {
                        resolve(msg);
                    } catch (e) {
                        reject(e);
                    }
                },
                data,
                requestConfig()
            );
        });
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
