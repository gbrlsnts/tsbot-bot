"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BotFactory_1 = require("./Bot/BotFactory");
const ConnectionProtocol_1 = require("./Bot/ConnectionProtocol");
const configuration = {
    host: '192.168.1.200',
    queryport: 10011,
    serverport: 9987,
    nickname: 'TS BOT',
    protocol: ConnectionProtocol_1.ConnectionProtocol.raw,
    username: 'bot',
    password: 'zFScOXvI'
};
const bot = new BotFactory_1.BotFactory(configuration);
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
//# sourceMappingURL=index.js.map