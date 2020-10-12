import { Client } from 'nats';
import { InstanceManager } from '../Instance/InstanceManager';
import { NatsConnector } from './Nats/Connector';
import { CommandGateway } from './Gateway';
import { SubscribesServerMessages } from './Subscribers/Interfaces';
import { CreateUserChannelSubscriber } from './Subscribers/Actions/CreateUserChannel';
import { DeleteUserChannelSubscriber } from './Subscribers/Actions/DeleteUserChannel';
import { CreateUserSubChannelSubscriber } from './Subscribers/Actions/CreateUserSubChannel';
import { GetSubChannelCountSubscriber } from './Subscribers/Getters/GetSubChannelCount';
import { ValidateChannelsUniqueSubscriber } from './Subscribers/Getters/ValidateChannelUnique';
import { GetIconsSubscriber } from './Subscribers/Getters/GetIcons';
import { GetGroupsSubscriber } from './Subscribers/Getters/GetServerGroups';
import { SetUserGroupsSubscriber } from './Subscribers/Actions/SetUserGroups';
import { IconUploadSubscriber } from './Subscribers/Actions/IconUpload';
import { IconDeleteSubscriber } from './Subscribers/Actions/IconDelete';
import { VerifyUserSubscriber } from './Subscribers/Actions/VerifyUser';
import { GetUsersByAddressSubscriber } from './Subscribers/Getters/GetUsersByAddress';
import { GetUserServerGroupIdsSubscriber } from './Subscribers/Getters/GetUserServerGroupIds';
import { GetChannelZoneSubscriber } from './Subscribers/Getters/GetChannelZone';
import Logger from '../Log/Logger';
import { HandleCrawlUpdatedEvent } from './Subscribers/Events/HandleCrawlUpdatedEvent';

export class Commands {
    constructor(
        private readonly logger: Logger,
        private readonly natsClient: NatsConnector,
        private readonly manager: InstanceManager
    ) {}

    async init(): Promise<void> {
        const gateway = new CommandGateway(
            this.logger,
            this.manager,
            this.natsClient.getClient()
        );
        gateway.subscribe(this.getServerSubscribers());

        this.logger.info('Command gateway initialized');
    }

    getServerSubscribers(): SubscribesServerMessages[] {
        return [
            new CreateUserChannelSubscriber(),
            new CreateUserSubChannelSubscriber(),
            new DeleteUserChannelSubscriber(),
            new GetSubChannelCountSubscriber(),
            new GetGroupsSubscriber(),
            new GetIconsSubscriber(),
            new ValidateChannelsUniqueSubscriber(),
            new SetUserGroupsSubscriber(),
            new IconUploadSubscriber(),
            new IconDeleteSubscriber(),
            new VerifyUserSubscriber(),
            new GetUsersByAddressSubscriber(),
            new GetUserServerGroupIdsSubscriber(),
            new GetChannelZoneSubscriber(),
            new HandleCrawlUpdatedEvent(),
        ];
    }
}
