"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserChannelAction_1 = require("../../../Bot/Action/CreateUserChannel/CreateUserChannelAction");
class CreateUserChannel {
    constructor(app, bot) {
        this.app = app;
        this.bot = bot;
    }
    register() {
        this.app.post('/bot/server/createUserChannel', async (req, res) => {
            const createUserChannel = new CreateUserChannelAction_1.CreateUserChannelAction(this.bot, req.body);
            createUserChannel.execute()
                .then(result => {
                result.applyOnRight(data => res.send(data));
                // handling expected error
                if (result.isLeft()) {
                    res.status(422).send(result.value);
                }
            })
                .catch(e => {
                console.log('Sending error response...', e.message);
                res.status(500).send(e.message);
            });
        });
    }
}
exports.CreateUserChannel = CreateUserChannel;
//# sourceMappingURL=CreateUserChannel.js.map