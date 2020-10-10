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
const SetUserGroups_1 = require("./Subscribers/Actions/SetUserGroups");
const IconUpload_1 = require("./Subscribers/Actions/IconUpload");
const IconDelete_1 = require("./Subscribers/Actions/IconDelete");
const VerifyUser_1 = require("./Subscribers/Actions/VerifyUser");
const GetUsersByAddress_1 = require("./Subscribers/Getters/GetUsersByAddress");
const GetUserServerGroupIds_1 = require("./Subscribers/Getters/GetUserServerGroupIds");
const GetChannelZone_1 = require("./Subscribers/Getters/GetChannelZone");
class Commands {
    constructor(logger, manager) {
        this.logger = logger;
        this.manager = manager;
    }
    async init() {
        const nats = await new Connector_1.NatsConnector().connect();
        const gateway = new Gateway_1.CommandGateway(this.logger, this.manager, nats);
        gateway.subscribe(this.getServerSubscribers());
        this.logger.info('Command gateway initialized');
    }
    getServerSubscribers() {
        return [
            new CreateUserChannel_1.CreateUserChannelSubscriber(),
            new CreateUserSubChannel_1.CreateUserSubChannelSubscriber(),
            new DeleteUserChannel_1.DeleteUserChannelSubscriber(),
            new GetSubChannelCount_1.GetSubChannelCountSubscriber(),
            new GetServerGroups_1.GetGroupsSubscriber(),
            new GetIcons_1.GetIconsSubscriber(),
            new ValidateChannelUnique_1.ValidateChannelsUniqueSubscriber(),
            new SetUserGroups_1.SetUserGroupsSubscriber(),
            new IconUpload_1.IconUploadSubscriber(),
            new IconDelete_1.IconDeleteSubscriber(),
            new VerifyUser_1.VerifyUserSubscriber(),
            new GetUsersByAddress_1.GetUsersByAddressSubscriber(),
            new GetUserServerGroupIds_1.GetUserServerGroupIdsSubscriber(),
            new GetChannelZone_1.GetChannelZoneSubscriber(),
        ];
    }
}
exports.Commands = Commands;
//# sourceMappingURL=Commands.js.map