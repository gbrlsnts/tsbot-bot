"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const Error_1 = require("../../../Bot/Error");
class GetUserServerGroupIdsSubscriber {
    constructor() {
        this.subject = 'bot.server.*.user.sgroups';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    }
    getServerIdPosition() {
        return this.serverIdPos;
    }
    getSubject() {
        return this.subject;
    }
    getValidationSchema() {
        return null;
    }
    async handle(botManager, msg) {
        if (!botManager.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        const client = await botManager.bot.getClientByDatabaseId(msg.data);
        if (!client)
            return Library_1.left(Error_1.invalidClientError());
        return Library_1.right(client.servergroups || []);
    }
}
exports.GetUserServerGroupIdsSubscriber = GetUserServerGroupIdsSubscriber;
//# sourceMappingURL=GetUserServerGroupIds.js.map