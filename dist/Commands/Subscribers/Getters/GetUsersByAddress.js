"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const SharedRules_1 = require("../../../Validation/SharedRules");
const Error_1 = require("../../../Bot/Error");
class GetUsersByAddressSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.user.get-by-addr';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.bot = manager.bot;
    }
    getServerIdPosition() {
        return this.serverIdPos;
    }
    getSubject() {
        return this.subject;
    }
    getValidationSchema() {
        return SharedRules_1.clientIpAddress;
    }
    async handle(msg) {
        const address = msg.data;
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        const clients = await this.bot.getClientsByAddress(address);
        return Library_1.right(clients.map(c => ({
            id: c.clid,
            dbId: c.databaseId,
            uid: c.uniqueIdentifier,
        })));
    }
}
exports.GetUsersByAddressSubscriber = GetUsersByAddressSubscriber;
//# sourceMappingURL=GetUsersByAddress.js.map