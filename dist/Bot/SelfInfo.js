"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelfInfo {
    constructor(server, info) {
        this.server = server;
        this._info = info;
    }
    /**
     * Initialize the object
     * @param server The server instance
     */
    static async initialize(server) {
        const info = await this.getInfo(server);
        return new SelfInfo(server, info);
    }
    /**
     * Get the connection info
     */
    static async getInfo(server) {
        const whoami = await server.whoami();
        return {
            clientId: whoami.client_id,
            databaseId: whoami.client_database_id,
            clientUniqueId: whoami.client_unique_identifier,
            serverId: whoami.virtualserver_id,
            uniqueServerId: whoami.virtualserver_unique_identifier,
        };
    }
    /**
     * Refresh the connection info
     */
    async issueRefresh() {
        this._info = await SelfInfo.getInfo(this.server);
    }
    /**
     * Get the info object
     */
    get info() {
        return this._info;
    }
}
exports.default = SelfInfo;
//# sourceMappingURL=SelfInfo.js.map