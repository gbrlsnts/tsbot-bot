import Manager from '../Bot/Manager';
import { NatsConnector } from './Nats/Connector';
import { CommandGateway } from './Gateway';
import { ServerMsgSubscriber } from './Subscribers/Interfaces';
import { CreateUserChannelSubscriber } from './Subscribers/Actions/CreateUserChannel';
import { DeleteUserChannelSubscriber } from './Subscribers/Actions/DeleteUserChannel';
import { CreateUserSubChannelSubscriber } from './Subscribers/Actions/CreateUserSubChannel';
import { GetSubChannelCountSubscriber } from './Subscribers/Getters/GetSubChannelCount';
import { ValidateChannelsUniqueSubscriber } from './Subscribers/Getters/ValidateChannelUnique';
import { GetIconsSubscriber } from './Subscribers/Getters/GetIcons';
import { GetServerGroupsSubscriber } from './Subscribers/Getters/GetServerGroups';
import { SetUserGroupsSubscriber } from './Subscribers/Actions/SetUserGroups';
import { IconUploadSubscriber } from './Subscribers/Actions/IconUpload';
import { IconDeleteSubscriber } from './Subscribers/Actions/IconDelete';
import { VerifyUserSubscriber } from './Subscribers/Actions/VerifyUser';
import { GetUsersByAddressSubscriber } from './Subscribers/Getters/GetUsersByAddress';
import { GetUserServerGroupIdsSubscriber } from './Subscribers/Getters/GetUserServerGroupIds';

export class Commands {
    constructor(private manager: Manager) {}

    async init(): Promise<void> {
        const nats = await new NatsConnector().connect();

        const gateway = new CommandGateway(this.manager, nats);
        gateway.subscribe(this.getServerSubscribers());

        this.manager.logger.info('Command gateway initialized');
    }

    getServerSubscribers(): ServerMsgSubscriber[] {
        return [
            new CreateUserChannelSubscriber(this.manager),
            new CreateUserSubChannelSubscriber(this.manager),
            new DeleteUserChannelSubscriber(this.manager),
            new GetSubChannelCountSubscriber(this.manager),
            new GetServerGroupsSubscriber(this.manager),
            new GetIconsSubscriber(this.manager),
            new ValidateChannelsUniqueSubscriber(this.manager),
            new SetUserGroupsSubscriber(this.manager),
            new IconUploadSubscriber(this.manager),
            new IconDeleteSubscriber(this.manager),
            new VerifyUserSubscriber(this.manager),
            new GetUsersByAddressSubscriber(this.manager),
            new GetUserServerGroupIdsSubscriber(this.manager),
        ];
    }
}
