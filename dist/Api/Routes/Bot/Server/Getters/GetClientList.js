"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiRoute_1 = require("../../../../ApiRoute");
const Either_1 = require("../../../../../Lib/Either");
const Error_1 = require("../../../../../Bot/Error");
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
class GetClientList extends ApiRoute_1.ApiRoute {
    constructor(app, bot) {
        super();
        this.app = app;
        this.bot = bot;
    }
    /**
     * Register the route
     */
    register() {
        this.app.get(this.getWithPrefix('getClientList'), async (req, res) => {
            this.getClientList()
                .then((result) => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Get the server client list
     */
    async getClientList() {
        try {
            const clientList = await this.bot.getServer().clientList({
                client_type: ts3_nodejs_library_1.ClientType.Regular
            });
            return Either_1.right(clientList.map(this.mapClient));
        }
        catch (e) {
            return Either_1.left(Error_1.genericBotError());
        }
    }
    /**
     * Map a ts3 client to the response format
     * @param client the client to map
     */
    mapClient(client) {
        return {
            id: client.clid,
            channelId: client.cid,
            databaseId: client.databaseId,
            uid: client.uniqueIdentifier,
            nickname: client.nickname,
            serverGroupsId: client.servergroups || [],
            channelGroupId: client.channelGroupId || 0,
            ip: client.connectionClientIp || '',
        };
    }
}
exports.default = GetClientList;
//# sourceMappingURL=GetClientList.js.map