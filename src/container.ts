import * as awilix from 'awilix';
import { resolve as pathResolve } from 'path';
import { Factory as LoaderFactory } from './Bot/Configuration/Factory';
import { LoaderInterface } from './Bot/Configuration/LoaderInterface';
import Factory from './Bot/Factory';

export default function configureContainer(): awilix.AwilixContainer {
    const container = awilix.createContainer({
        injectionMode: "CLASSIC",
    });

    container.register({
        configLoader: awilix.asValue<LoaderInterface>(configurationLoader()),
        botFactory: awilix.asClass(Factory).singleton(),
    });

    return container;
};

const configurationLoader = () => {
    return new LoaderFactory({
        mode: 'local',
        configFolder: pathResolve('server_configs'),
    }).create();
};