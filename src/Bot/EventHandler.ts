import { TeamSpeak } from "ts3-nodejs-library";

export class EventHandler
{
    constructor(private server: TeamSpeak)
    {
        this.registerEvents();

        this.registerClientConnectHandler();
        this.registerTextMessageHandler();
    }

    private registerEvents()
    {
        Promise.all([
            this.server.registerEvent("server"),
            this.server.registerEvent("channel", 0),
            this.server.registerEvent("textserver"),
            this.server.registerEvent("textchannel"),
            this.server.registerEvent("textprivate")
          ])
    }

    private registerClientConnectHandler()
    {
        this.server.on('clientconnect', event => {
            console.log('Client Connect', event);
        });
    }

    private registerTextMessageHandler()
    {
        this.server.on('textmessage', event => {
            console.log('Server Event', event);
        });
    }
}