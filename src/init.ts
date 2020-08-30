import * as awilix from 'awilix';
import Factory from './Bot/Factory';
import { Api } from './Api/Api';
import configureContainer from './container';
import Logger from './Log/Logger';
import { Commands } from './Commands/Commands';

const container = configureContainer();
const scoped = container.createScope();

const logger = scoped.resolve<Logger>('logger');

scoped.register({
    serverName: awilix.asValue('testserver'),
});

logger.debug('Initializing instance');

container
    .resolve<Factory>('botFactory')
    .create(scoped.resolve('serverName'))
    .then(async manager => {
        scoped.register({
            manager: awilix.asValue(manager),
            bot: awilix.asValue(manager.bot),
            logger: awilix.asValue(manager.logger),
        });

        //new Api(manager, logger).boot();
        await new Commands(manager).init();
    })
    .catch(error => {
        logger.error('Error initializing bot', { error });
    });
