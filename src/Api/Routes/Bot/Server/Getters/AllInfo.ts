import { ClientType } from "ts3-nodejs-library";
import { Express } from "express";
import { Route } from "../../../../ApiTypes";
import { ApiRoute } from "../../../../ApiRoute";
import { Bot } from "../../../../../Bot/Bot";
import { Either, right, left } from "../../../../../Lib/Either";
import { Failure } from "../../../../../Lib/Failure";
import { BotError, genericBotError } from "../../../../../Bot/Error";
import { AllInfoResponse, ClientResponse, ChannelResponse, ServerResponse, ServerGroupResponse } from "../../../../Responses";
import Logger from "../../../../../Log/Logger";

export default class GetClientList extends ApiRoute implements Route
{
    constructor(private readonly app: Express, private readonly bot: Bot, private readonly logger: Logger)
    {
        super(logger);
    }

    /**
     * Register the route
     */
    register(): this {
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
    private async getAllInfo(params: Object): Promise<Either<Failure<BotError>, AllInfoResponse>>
    {
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

            return right({
                server,
                serverGroups,
                clients,
                channels,
            });
        } catch(error) {
            this.logger.error('Get info error:', { error });
            return left(genericBotError());
        }
    }
    
    /**
     * Get the server client list
     */
    private async getServerInfo(toFetch = true): Promise<ServerResponse | undefined>
    {
        if(!toFetch)
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

    private async getServerGroups(toFetch = true): Promise<ServerGroupResponse[] | undefined>
    {
        if(!toFetch)
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
    private async getClientList(toFetch = true): Promise<ClientResponse[] | undefined>
    {
        if(!toFetch)
            return;

        const clientList = await this.bot.getServer().clientList({
            client_type: ClientType.Regular
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
    private async getChannelList(toFetch = true): Promise<ChannelResponse[] | undefined>
    {
        if(!toFetch)
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