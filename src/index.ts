import { Factory } from './Bot/Factory';
import { ConnectionProtocol } from './Bot/ConnectionProtocol';

const configuration = {
    host: '192.168.1.200',
    queryport: 10011,
    serverport: 9987,
    nickname: 'TS BOT',
    protocol: ConnectionProtocol.raw,
    username: 'bot',
    password: 'zFScOXvI'
};

const bot = new Factory(configuration);

bot.create()
    .then(bot => {
        bot.whoami().then(whoami => {
            console.log(whoami);
            return bot.sendServerMessage('Hello all!');
        });
    })
    .catch(error => {
        console.log('Got error', error);
    });