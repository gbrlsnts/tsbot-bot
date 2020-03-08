"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserChannel_1 = require("./Server/CreateUserChannel");
const CreateUserSubChannel_1 = require("./Server/CreateUserSubChannel");
const DeleteUserChannel_1 = require("./Server/DeleteUserChannel");
class ServerGroup {
    constructor(app, bot) {
        this.app = app;
        this.bot = bot;
    }
    register() {
        new CreateUserChannel_1.CreateUserChannel(this.app, this.bot).register();
        new CreateUserSubChannel_1.CreateUserSubChannel(this.app, this.bot).register();
        new DeleteUserChannel_1.DeleteUserChannel(this.app, this.bot).register();
    }
}
exports.ServerGroup = ServerGroup;
//# sourceMappingURL=ServerGroup.js.map