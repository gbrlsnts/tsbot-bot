"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Factory_1 = require("./Bot/Factory");
const Api_1 = require("./Api/Api");
const botFactory = new Factory_1.Factory();
botFactory.create('testserver')
    .then(bot => {
    bot.sendServerMessage('Hello all!');
    new Api_1.Api(bot).boot();
})
    .catch(error => {
    console.log('Got error', error);
});
//# sourceMappingURL=index.js.map