import { TeamSpeak } from "ts3-nodejs-library";
import { SelfInfoData } from "./Types";

export default class SelfInfo
{
    _info: SelfInfoData;

    constructor(private readonly server: TeamSpeak, info: SelfInfoData)
    {
        this._info = info;
    }

    /**
     * Initialize the object
     * @param server The server instance
     */
    static async initialize(server: TeamSpeak): Promise<SelfInfo>
    {
        const info = await this.getInfo(server);

        return new SelfInfo(server, info);
    }

    /**
     * Get the connection info
     */
    static async getInfo(server: TeamSpeak): Promise<SelfInfoData>
    {
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
    async issueRefresh(): Promise<void>
    {
        this._info = await SelfInfo.getInfo(this.server);
    }

    /**
     * Get the info object
     */
    get info(): SelfInfoData
    {
        return this._info;
    }
}