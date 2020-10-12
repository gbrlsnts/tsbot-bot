import config from 'config';
import { resolve as pathResolve } from 'path';
import {
    Factory as LoaderFactory,
    LoaderFactoryConfig,
} from './Bot/Configuration/Factory';
import BotFactory from './Bot/Factory';
import {
    Factory as RepositoryFactory,
    RepositoryFactoryConfig,
} from './Bot/Repository/Factory';
import Logger from './Log/Logger';
import { Commands } from './Commands/Commands';
import { InstanceManager } from './Instance/InstanceManager';
import { NatsConnector } from './Commands/Nats/Connector';

const loadMode = process.env.LOAD_MODE || config.get('server.mode');
const server: string =
    process.env.SERVER_NAME || config.get('server.local.name');

const logger = new Logger({ level: 'debug' });
logger.debug('Initializing instance');

bootstrap().catch(error => {
    logger.error('Error loading bot instance', { error });
});

async function bootstrap() {
    const natsClient = new NatsConnector();
    await natsClient.connect();

    const configs = buildDependencyConfigs(natsClient);

    const configLoader = new LoaderFactory(configs.loader).create();
    const repository = new RepositoryFactory(configs.repository).create();

    const instanceManager = new InstanceManager(
        new BotFactory(configLoader, repository, logger, natsClient)
    );

    new Commands(logger, natsClient, instanceManager).init();

    await instanceManager.loadInstance(server);
}

function buildDependencyConfigs(
    client: NatsConnector
): { loader: LoaderFactoryConfig; repository: RepositoryFactoryConfig } {
    let loader: LoaderFactoryConfig;
    let repository: RepositoryFactoryConfig;

    switch (loadMode) {
        case 'local':
            loader = {
                mode: 'local',
                configFolder: pathResolve('server_configs'),
            };

            repository = {
                mode: 'local',
                configFolder: pathResolve('database'),
            };

            break;

        case 'nats':
            loader = repository = {
                mode: 'nats',
                client,
            };

            break;

        default:
            throw new Error('Invalid server mode. valid: local, nats');
    }

    return { loader, repository };
}
