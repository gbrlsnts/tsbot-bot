import { Factory } from './Bot/Factory';
import { CreateUserChannelAction } from './Bot/Actions/CreateUserChannel/CreateUserChannelAction';
import { CreateUserChannelData } from './Bot/Actions/CreateUserChannel/CreateUserChannelData';

const botFactory = new Factory();

botFactory.create('testserver')
    .then(bot => {
        bot.sendServerMessage('Hello all!');

        const channelData: CreateUserChannelData = {
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

        const createChannelAction = new CreateUserChannelAction(bot, channelData);
        
        createChannelAction.execute()
            .then(result => console.log(result.getResultData()))
            .catch(e => console.log(e));

    })
    .catch(error => {
        console.log('Got error', error);
    });