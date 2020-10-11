import { RepositoryInterface } from './RepositoryInterface';
import { LocalRepository } from './LocalRepository';
import { NatsRepository } from './Nats/NatsRepository';
import { NatsConnector } from '../../Commands/Nats/Connector';

export class Factory {
    constructor(readonly config: RepositoryFactoryConfig) {}

    /**
     * Create the repository object
     */
    create(): RepositoryInterface {
        switch (this.config.mode) {
            case 'local':
                return new LocalRepository(this.config.configFolder);

            case 'nats':
                return new NatsRepository(this.config.client);

            default:
                throw new Error('invalid repository mode. valid: local, nats');
        }
    }
}

export declare type RepositoryFactoryConfig =
    | LocalRepositoryOptions
    | NatsRepositoryOptions;

export interface LocalRepositoryOptions {
    /** Repository mode */
    mode: 'local';
    /** Server config path */
    configFolder: string;
}

export interface NatsRepositoryOptions {
    /** Repository mode */
    mode: 'nats';
    /** nats client */
    client: NatsConnector;
}
