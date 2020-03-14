import { Express } from "express";
import { Route } from "../../../../ApiTypes";
import { ApiRoute } from "../../../../ApiRoute";
import { Bot } from "../../../../../Bot/Bot";
import { Either, right, left } from "../../../../../Lib/Either";
import { Failure } from "../../../../../Lib/Failure";
import { BotError, genericBotError } from "../../../../../Bot/Error";
import { TeamSpeakClient, ClientType } from "ts3-nodejs-library";
import { ClientResponse } from "../../../../Responses";

export default class GetClientList extends ApiRoute implements Route
{
    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): this {
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
    private async getClientList(): Promise<Either<Failure<BotError>, ClientResponse[]>>
    {
        try {
            const clientList = await this.bot.getServer().clientList({
                client_type: ClientType.Regular
            });

            return right(clientList.map(this.mapClient));
        } catch(e) {
            return left(genericBotError());
        }
    }

    /**
     * Map a ts3 client to the response format
     * @param client the client to map
     */
    private mapClient(client: TeamSpeakClient): ClientResponse
    {
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