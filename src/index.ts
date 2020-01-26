import { Factory } from './Bot/Factory';
import { ConnectionProtocol } from './Bot/ConnectionProtocol';

const configuration = {
    host: '192.168.1.200',
    queryport: 10011,
    serverport: 9987,
    nickname: 'TS BOT',
    protocol: ConnectionProtocol.RAW,
    username: 'bot',
    password: 'zFScOXvI'
};

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