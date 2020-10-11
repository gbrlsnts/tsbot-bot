import { Req } from 'nats';
import { Configuration } from './Configuration';
import { LoaderInterface } from './LoaderInterface';
import { NatsConnector } from '../../Commands/Nats/Connector';

export class NatsLoader implements LoaderInterface {
    private readonly getConfigSubject = 'backend.server.10.config.get';

    /**
     * Load a server configuration for the bot to use
     * @param name The configuration name
     */
    async loadConfiguration(name: string): Promise<Configuration> {
        const nats = await new NatsConnector().connect();

        let req: Req | undefined;

        return new Promise<Configuration>((resolve, reject) => {
            req = nats.request(
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
