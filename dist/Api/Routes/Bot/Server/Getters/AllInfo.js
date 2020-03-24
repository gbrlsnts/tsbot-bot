"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
const ApiRoute_1 = require("../../../../ApiRoute");
const Either_1 = require("../../../../../Lib/Either");
const Error_1 = require("../../../../../Bot/Error");
class GetClientList extends ApiRoute_1.ApiRoute {
    constructor(app, bot, logger) {
        super(logger);
        this.app = app;
        this.bot = bot;
    }
    /**
     * Register the route
     */
    register() {
        this.app.get(this.getWithPrefix('getInfo'), async (req, res) => {
            this.getAllInfo(req.query)
                .then((result) => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Get all server information
     * @param params Request query params
     */
    async getAllInfo(params) {
        const filters = {
            server: params.hasOwnProperty('server'),
            serverGroups: params.hasOwnProperty('servergroups'),
            clients: params.hasOwnProperty('clients'),
            channels: params.hasOwnProperty('channels'),
        };
        const noFilters = Object.values(filters).every(value => value === false);
        try {
            const [server, serverGroups, clients, channels] = await Promise.all([
                this.getServerInfo(filters.server || noFilters),
                this.getServerGroups(filters.serverGroups || noFilters),
                this.getClientList(filters.clients || noFilters),
                this.getChannelList(filters.channels || noFilters),
            ]);
            return Either_1.right({
                server,
                serverGroups,
                clients,
                channels,
            });
        }
        catch (e) {
            console.log('Get info error:', e);
            return Either_1.left(Error_1.genericBotError());
        }
    }
    /**
     * Get the server client list
     */
    async getServerInfo(toFetch = true) {
        if (!toFetch)
            return;
        const serverInfo = await this.bot.getServer().serverInfo();
        return {
            uniqueId: serverInfo.virtualserver_unique_identifier,
            name: serverInfo.virtualserver_name,
            status: serverInfo.virtualserver_status,
            maxClients: serverInfo.virtualserver_maxclients,
            iconId: serverInfo.virtualserver_icon_id
        };
    }
    async getServerGroups(toFetch = true) {
        if (!toFetch)
            return;
        const serverGroups = await this.bot.getServer().serverGroupList({
            type: 1,
        });
        return serverGroups.map(group => ({
            id: group.sgid,
            name: group.name,
            iconId: group.iconid,
            order: group.sortid,
        }));
    }
    /**
     * Get the server client list
     */
    async getClientList(toFetch = true) {
        if (!toFetch)
            return;
        const clientList = await this.bot.getServer().clientList({
            client_type: ts3_nodejs_library_1.ClientType.Regular
        });
        return clientList.map(client => ({
            id: client.clid,
            channelId: client.cid,
            databaseId: client.databaseId,
            uid: client.uniqueIdentifier,
            nickname: client.nickname,
            serverGroupsId: client.servergroups || [],
            channelGroupId: client.channelGroupId || 0,
            ip: client.connectionClientIp || '',
        }));
    }
    /**
     * Get the server channel list
     */
    async getChannelList(toFetch = true) {
        if (!toFetch)
            return;
        const channelList = await this.bot.getServer().channelList();
        return channelList.map(channel => ({
            id: channel.cid,
            pid: channel.pid,
            name: channel.name,
            order: channel.order,
        }));
    }
}
exports.default = GetClientList;
//# sourceMappingURL=AllInfo.js.map