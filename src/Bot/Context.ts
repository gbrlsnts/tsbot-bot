export class Context
{
    constructor(  
        private databaseId: number,
        private clientId: number,
        private clientUniqueId: string,
        private serverId: number,
        private serverUniqueId: string
        )
    {
        console.log('context', this);
    }

    getDatabaseId(): number
    {
        return this.databaseId;
    }

    getClientId(): number
    {
        return this.clientId;
    }

    getClientUniqueId(): string
    {
        return this.clientUniqueId;
    }

    getServerId(): number
    {
        return this.serverId;
    }

    getServerUniqueId(): string
    {
        return this.serverUniqueId;
    }
}