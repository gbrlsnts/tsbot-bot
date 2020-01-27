"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Factory_1 = require("./Bot/Factory");
const CreateUserChannelAction_1 = require("./Bot/Actions/CreateUserChannel/CreateUserChannelAction");
const botFactory = new Factory_1.Factory();
botFactory.create('testserver')
    .then(bot => {
    bot.sendServerMessage('Hello all!');
    const channelData = {
        userChannelStart: 132,
        userChannelEnd: 34,
        owner: 3,
        channelGroupToAssign: 9,
        channels: [
            {
                name: 'First Channel',
                channels: [
                    { name: 'Subchannel 1', channels: [] },
                    { name: 'Subchannel 2', channels: [] },
                ]
            },
            { name: 'Second Channel', password: 'pass123', channels: [] },
        ]
    };
    const createChannelAction = new CreateUserChannelAction_1.CreateUserChannelAction(bot, channelData);
    createChannelAction.execute()
        .then(result => console.log(result.getResultData()))
        .catch(e => console.log(e));
})
    .catch(error => {
    console.log('Got error', error);
});
//# sourceMappingURL=index.js.map