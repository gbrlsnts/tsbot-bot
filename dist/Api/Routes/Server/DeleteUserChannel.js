"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiRoute_1 = require("../../ApiRoute");
const DeleteUserChannelAction_1 = require("../../../Bot/Action/UserChannel/DeleteUserChannel/DeleteUserChannelAction");
class DeleteUserChannel extends ApiRoute_1.ApiRoute {
    constructor(app, bot) {
        super();
        this.app = app;
        this.bot = bot;
    }
    /**
     * Register the route
     */
    register() {
        this.app.post('/bot/server/deleteUserChannel', async (req, res) => {
            const deleteUserChannel = new DeleteUserChannelAction_1.DeleteUserChannelAction(this.bot, req.body);
            deleteUserChannel.execute()
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
    }
}
exports.DeleteUserChannel = DeleteUserChannel;
//# sourceMappingURL=DeleteUserChannel.js.map