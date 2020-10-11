import config from 'config';
import { resolve as pathResolve } from 'path';
import {
    Factory as LoaderFactory,
    LoaderFactoryConfig,
} from './Bot/Configuration/Factory';
import Factory from './Bot/Factory';
import Logger from './Log/Logger';
import { Commands } from './Commands/Commands';
import { InstanceManager } from './Instance/InstanceManager';
import { NatsConnector } from './Commands/Nats/Connector';
import { Client } from 'nats';

const loadMode = process.env.LOAD_MODE || config.get('server.mode');
const server: string =
    process.env.SERVER_NAME || config.get('server.local.name');

const logger = new Logger({ level: 'debug' });
logger.debug('Initializing instance');

bootstrap().catch(error => {
    logger.error('Error loading bot instance', { error });
});

async function bootstrap() {
    const natsClient = await new NatsConnector().connect();

    const configLoader = new LoaderFactory(
        buildLoaderConfig(natsClient)
    ).create();

    const instanceManager = new InstanceManager(
        new Factory(configLoader, logger)
    );
    new Commands(logger, natsClient, instanceManager).init();

    await instanceManager.loadInstance(server);
}

function buildLoaderConfig(client: Client): LoaderFactoryConfig {
    let loaderFactoryConfig: LoaderFactoryConfig;

    switch (loadMode) {
        case 'local':
            loaderFactoryConfig = {
                mode: 'local',
                configFolder: pathResolve('server_configs'),
            };

            break;

        case 'nats':
            loaderFactoryConfig = {
                mode: 'nats',
                client,
            };

            break;

        default:
            throw new Error('Invalid server mode. valid: local, nats');
    }

    return loaderFactoryConfig;
}
