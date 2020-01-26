import { Factory } from './Bot/Factory';

const botFactory = new Factory();

botFactory.create('testserver')
    .then(bot => {
        bot.sendServerMessage('Hello all!');

        bot.createChannel('Test channel')
            .then(channel => console.log(channel))
            .catch(e => console.log(e.msg));

    })
    .catch(error => {
        console.log('Got error', error);
    });