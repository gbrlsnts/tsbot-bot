"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserChannel_1 = require("./Server/CreateUserChannel");
class ServerGroup {
    constructor(app, bot) {
        this.app = app;
        this.bot = bot;
    }
    register() {
        new CreateUserChannel_1.CreateUserChannel(this.app, this.bot).register();
    }
}
exports.ServerGroup = ServerGroup;
//# sourceMappingURL=ServerGroup.js.map