import { LoaderInterface } from './LoaderInterface';
import { LocalLoader } from './LocalLoader';
import { NatsLoader } from './NatsLoader';
import { NatsConnector } from '../../Commands/Nats/Connector';

export class Factory {
    constructor(readonly config: LoaderFactoryConfig) {}

    create(): LoaderInterface {
        switch (this.config.mode) {
            case 'local':
                return new LocalLoader(this.config.configFolder);

            case 'nats':
                return new NatsLoader(this.config.client);

            default:
                throw new Error('invalid server mode. valid: local, nats');
        }
    }
}

export declare type LoaderFactoryConfig =
    | LocalLoaderOptions
    | NatsLoaderOptions;

export interface LocalLoaderOptions {
    /** Loader mode */
    mode: 'local';
    /** Server config path */
    configFolder: string;
}

export interface NatsLoaderOptions {
    /** Loader mode */
    mode: 'nats';
    /** nats client */
    client: NatsConnector;
}
