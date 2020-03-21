import * as awilix from 'awilix';
import Factory from './Bot/Factory';
import { Api } from './Api/Api';
import configureContainer from './container';

const container = configureContainer();

const scoped = container.createScope();

scoped.register({
    serverName: awilix.asValue('testserver'),
});

container.resolve<Factory>('botFactory')
    .create(scoped.resolve('serverName'))
    .then(manager => {
        scoped.register('bot', awilix.asValue(manager.bot));
        new Api(manager).boot();
    })
    .catch(error => {
        console.log('Got error', error);
    });