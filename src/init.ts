import config from 'config';
import * as awilix from 'awilix';
import Factory from './Bot/Factory';
import configureContainer from './container';
import Logger from './Log/Logger';
import { Commands } from './Commands/Commands';
import { InstanceManager } from './Instance/InstanceManager';

const natsEnabled = process.env.NATS_ENABLED || config.get('nats.enabled');

const container = configureContainer();
const scoped = container.createScope();

const logger = scoped.resolve<Logger>('logger');

scoped.register({
    serverName: awilix.asValue(
        process.env.SERVER_NAME || config.get('server.name')
    ),
});

logger.debug('Initializing instance');

const botFactory = container.resolve<Factory>('botFactory');
const instanceManager = new InstanceManager(botFactory);

new Promise(async (resolve, reject) => {
    try {
        if (natsEnabled) await new Commands(logger, instanceManager).init();
    } catch (error) {
        return reject(error);
    }

    resolve();
})
    .then(() => {
        return instanceManager.loadInstance(scoped.resolve('serverName'));
    })
    .catch(error => {
        logger.error('Error loading bot instance', { error });
    });
