"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserChannel_1 = require("./UserChannel/CreateUserChannel");
const CreateUserSubChannel_1 = require("./UserChannel/CreateUserSubChannel");
const DeleteUserChannel_1 = require("./UserChannel/DeleteUserChannel");
const PrefixedRoute_1 = require("../../../PrefixedRoute");
const AllInfo_1 = __importDefault(require("./Getters/AllInfo"));
const VerifyUser_1 = __importDefault(require("./VerifyUser/VerifyUser"));
const IconUpload_1 = __importDefault(require("./Icon/IconUpload"));
const IconDelete_1 = __importDefault(require("./Icon/IconDelete"));
const SetUserGroups_1 = __importDefault(require("./UserGroups/SetUserGroups"));
class ServerGroup extends PrefixedRoute_1.PrefixedRoute {
    constructor(app, bot, logger) {
        super();
        this.app = app;
        this.bot = bot;
        this.logger = logger;
    }
    /**
     * Register the route
     */
    register() {
        const routes = [
            new CreateUserChannel_1.CreateUserChannel(this.app, this.bot, this.logger),
            new CreateUserSubChannel_1.CreateUserSubChannel(this.app, this.bot, this.logger),
            new DeleteUserChannel_1.DeleteUserChannel(this.app, this.bot, this.logger),
            new AllInfo_1.default(this.app, this.bot, this.logger),
            new VerifyUser_1.default(this.app, this.bot, this.logger),
            new IconUpload_1.default(this.app, this.bot, this.logger),
            new IconDelete_1.default(this.app, this.bot, this.logger),
            new SetUserGroups_1.default(this.app, this.bot, this.logger),
        ];
        routes.forEach(route => route.setPrefix(this.prefix).register());
        return this;
    }
}
exports.ServerGroup = ServerGroup;
//# sourceMappingURL=ServerGroup.js.map