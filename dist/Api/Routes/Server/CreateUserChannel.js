"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserChannelAction_1 = require("../../../Bot/Action/CreateUserChannel/CreateUserChannelAction");
const ApiRoute_1 = require("../../ApiRoute");
class CreateUserChannel extends ApiRoute_1.ApiRoute {
    constructor(app, bot) {
        super();
        this.app = app;
        this.bot = bot;
    }
    /**
     * Register the route
     */
    register() {
        this.app.post('/bot/server/createUserChannel', async (req, res) => {
            const createUserChannel = new CreateUserChannelAction_1.CreateUserChannelAction(this.bot, req.body);
            createUserChannel.execute()
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
    }
}
exports.CreateUserChannel = CreateUserChannel;
//# sourceMappingURL=CreateUserChannel.js.map