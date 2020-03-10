"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserChannel_1 = require("./UserChannel/CreateUserChannel");
const CreateUserSubChannel_1 = require("./UserChannel/CreateUserSubChannel");
const DeleteUserChannel_1 = require("./UserChannel/DeleteUserChannel");
const PrefixedRoute_1 = require("../../../PrefixedRoute");
class ServerGroup extends PrefixedRoute_1.PrefixedRoute {
    constructor(app, bot) {
        super();
        this.app = app;
        this.bot = bot;
    }
    register() {
        new CreateUserChannel_1.CreateUserChannel(this.app, this.bot).setPrefix(this.prefix).register();
        new CreateUserSubChannel_1.CreateUserSubChannel(this.app, this.bot).setPrefix(this.prefix).register();
        new DeleteUserChannel_1.DeleteUserChannel(this.app, this.bot).setPrefix(this.prefix).register();
        return this;
    }
}
exports.ServerGroup = ServerGroup;
//# sourceMappingURL=ServerGroup.js.map