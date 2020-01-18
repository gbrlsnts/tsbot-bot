import { TeamSpeak, TextMessageTargetMode } from "ts3-nodejs-library";

export class Bot
{
    constructor(private server: TeamSpeak)
    {

    }

    async whoami()
    {
        return await this.server.whoami();
    }

    async sendServerMessage(message: string)
    {
        try {
            await this.server.sendTextMessage(
                0,
                TextMessageTargetMode.SERVER,
                message
            );
        } catch(error) {
            console.log('Got error', error);
        }
    }
}