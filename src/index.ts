import { Factory } from './Bot/Factory';
import { Api } from './Api/Api';

const botFactory = new Factory();

botFactory.create('testserver')
    .then(bot => {
        new Api(bot).boot();
    })
    .catch(error => {
        console.log('Got error', error);
    });