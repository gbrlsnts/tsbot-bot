"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserChannel_1 = require("./UserChannel/CreateUserChannel");
const CreateUserSubChannel_1 = require("./UserChannel/CreateUserSubChannel");
const DeleteUserChannel_1 = require("./UserChannel/DeleteUserChannel");
const PrefixedRoute_1 = require("../../../PrefixedRoute");
const GetClientList_1 = __importDefault(require("./Getters/GetClientList"));
const VerifyUser_1 = __importDefault(require("./VerifyUser/VerifyUser"));
const IconUpload_1 = __importDefault(require("./Icon/IconUpload"));
const IconDelete_1 = __importDefault(require("./Icon/IconDelete"));
class ServerGroup extends PrefixedRoute_1.PrefixedRoute {
    constructor(app, bot) {
        super();
        this.app = app;
        this.bot = bot;
    }
    /**
     * Register the route
     */
    register() {
        const routes = [
            new CreateUserChannel_1.CreateUserChannel(this.app, this.bot),
            new CreateUserSubChannel_1.CreateUserSubChannel(this.app, this.bot),
            new DeleteUserChannel_1.DeleteUserChannel(this.app, this.bot),
            new GetClientList_1.default(this.app, this.bot),
            new VerifyUser_1.default(this.app, this.bot),
            new IconUpload_1.default(this.app, this.bot),
            new IconDelete_1.default(this.app, this.bot),
        ];
        routes.forEach(route => route.setPrefix(this.prefix).register());
        return this;
    }
}
exports.ServerGroup = ServerGroup;
//# sourceMappingURL=ServerGroup.js.map