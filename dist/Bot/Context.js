"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Context {
    constructor(databaseId, clientId, clientUniqueId, serverId, serverUniqueId) {
        this.databaseId = databaseId;
        this.clientId = clientId;
        this.clientUniqueId = clientUniqueId;
        this.serverId = serverId;
        this.serverUniqueId = serverUniqueId;
        console.log('context', this);
    }
    getDatabaseId() {
        return this.databaseId;
    }
    getClientId() {
        return this.clientId;
    }
    getClientUniqueId() {
        return this.clientUniqueId;
    }
    getServerId() {
        return this.serverId;
    }
    getServerUniqueId() {
        return this.serverUniqueId;
    }
}
exports.Context = Context;
//# sourceMappingURL=Context.js.map