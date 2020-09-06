"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Connector_1 = require("./Nats/Connector");
const Gateway_1 = require("./Gateway");
const CreateUserChannel_1 = require("./Subscribers/Actions/CreateUserChannel");
const DeleteUserChannel_1 = require("./Subscribers/Actions/DeleteUserChannel");
const CreateUserSubChannel_1 = require("./Subscribers/Actions/CreateUserSubChannel");
const GetSubChannelCount_1 = require("./Subscribers/Getters/GetSubChannelCount");
const ValidateChannelUnique_1 = require("./Subscribers/Getters/ValidateChannelUnique");
const GetIcons_1 = require("./Subscribers/Getters/GetIcons");
const GetServerGroups_1 = require("./Subscribers/Getters/GetServerGroups");
class Commands {
    constructor(manager) {
        this.manager = manager;
    }
    async init() {
        const nats = await new Connector_1.NatsConnector().connect();
        const gateway = new Gateway_1.CommandGateway(this.manager, nats);
        gateway.subscribe(this.getServerSubscribers());
        this.manager.logger.info('Command gateway initialized');
    }
    getServerSubscribers() {
        return [
            new CreateUserChannel_1.CreateUserChannelSubscriber(this.manager),
            new CreateUserSubChannel_1.CreateUserSubChannelSubscriber(this.manager),
            new DeleteUserChannel_1.DeleteUserChannelSubscriber(this.manager),
            new GetSubChannelCount_1.GetSubChannelCountSubscriber(this.manager),
            new GetServerGroups_1.GetServerGroupsSubscriber(this.manager),
            new GetIcons_1.GetIconsSubscriber(this.manager),
            new ValidateChannelUnique_1.ValidateChannelsUniqueSubscriber(this.manager),
        ];
    }
}
exports.Commands = Commands;
//# sourceMappingURL=Commands.js.map