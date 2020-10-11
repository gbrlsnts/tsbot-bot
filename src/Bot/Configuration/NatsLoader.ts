import { Req, Client } from 'nats';
import { Configuration } from './Configuration';
import { LoaderInterface } from './LoaderInterface';

export class NatsLoader implements LoaderInterface {
    private readonly getConfigSubject = 'backend.server.10.config.get';

    constructor(private readonly natsClient: Client) {}

    /**
     * Load a server configuration for the bot to use
     * @param name The configuration name
     */
    async loadConfiguration(name: string): Promise<Configuration> {
        let req: Req | undefined;

        return new Promise<Configuration>((resolve, reject) => {
            req = this.natsClient.request(
                this.getConfigSubject,
                (err, msg) => {
                    if (err) return reject(err);

                    try {
                        resolve(JSON.parse(msg.data));
                    } catch (e) {
                        reject(e);
                    }
                },
                '',
                {
                    max: 1,
                    timeout: 2000,
                }
            );
        }).finally(() => req?.cancel());
    }
}
