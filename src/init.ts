import config from 'config';
import { resolve as pathResolve } from 'path';
import { Factory as LoaderFactory } from './Bot/Configuration/Factory';
import Factory from './Bot/Factory';
import Logger from './Log/Logger';
import { Commands } from './Commands/Commands';
import { InstanceManager } from './Instance/InstanceManager';

const loadMode = process.env.LOAD_MODE || config.get('server.mode');
const server: string =
    process.env.SERVER_NAME || config.get('server.local.name');
const natsEnabled = process.env.NATS_ENABLED || config.get('nats.enabled');

const logger = new Logger({ level: 'debug' });
logger.debug('Initializing instance');

let instanceManager: InstanceManager;

new Promise(async (resolve, reject) => {
    if (loadMode == 'nats' && !natsEnabled)
        throw new Error('load mode is NATS but nats is disabled');

    try {
        const configLoader = new LoaderFactory({
            mode: config.get('server.mode'),
            configFolder: pathResolve('server_configs'),
        }).create();

        resolve(new InstanceManager(new Factory(configLoader, logger)));
    } catch (error) {
        reject(error);
    }
})
    .then(manager => {
        instanceManager = manager as InstanceManager;
        if (natsEnabled) return new Commands(logger, instanceManager).init();
    })
    .then(() => {
        return instanceManager.loadInstance(server);
    })
    .catch(error => {
        logger.error('Error loading bot instance', { error });
    });
