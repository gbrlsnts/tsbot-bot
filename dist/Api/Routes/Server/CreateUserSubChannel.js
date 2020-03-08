"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiRoute_1 = require("../../ApiRoute");
const CreateUserSubChannelAction_1 = require("../../../Bot/Action/UserChannel/CreateUserSubChannel/CreateUserSubChannelAction");
class CreateUserSubChannel extends ApiRoute_1.ApiRoute {
    constructor(app, bot) {
        super();
        this.app = app;
        this.bot = bot;
    }
    /**
     * Register the route
     */
    register() {
        this.app.post('/bot/server/createUserSubChannel', async (req, res) => {
            const createUserSubChannel = new CreateUserSubChannelAction_1.CreateUserSubChannelAction(this.bot, req.body);
            createUserSubChannel.execute()
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
    }
}
exports.CreateUserSubChannel = CreateUserSubChannel;
//# sourceMappingURL=CreateUserSubChannel.js.map