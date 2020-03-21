import { Bot } from "./Bot";
import { MasterEventHandler } from "./Event/MasterEventHandler";
import { Crawler } from "./Crawler/Crawler";

export default class Manager
{

    constructor(readonly components: Components)
    {

    }

    get bot(): Bot
    {
        return this.components.bot;
    }

    get eventHandler(): MasterEventHandler
    {
        return this.components.eventHandler;
    }

    get crawler(): Crawler | undefined
    {
        return this.components.crawler;
    }
}

export interface Components
{
    bot: Bot;
    eventHandler: MasterEventHandler,
    crawler?: Crawler,
}