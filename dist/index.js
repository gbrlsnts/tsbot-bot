"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Factory_1 = require("./Bot/Factory");
const botFactory = new Factory_1.Factory();
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
//# sourceMappingURL=index.js.map