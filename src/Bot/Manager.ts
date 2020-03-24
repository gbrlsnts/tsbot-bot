import { Bot } from "./Bot";
import { MasterEventHandler } from "./Event/MasterEventHandler";
import { Crawler } from "./Crawler/Crawler";
import { CrawlerConfiguration } from "./Configuration/Configuration";
import Logger from "../Log/Logger";

export default class Manager
{

    constructor(private components: Components)
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

    get logger(): Logger
    {
        return this.components.logger;
    }

    /**
     * Disables the crawler
     */
    disableCrawler(): void
    {
        this.crawler?.stop();
        this.components.crawler = undefined;
    }

    /**
     * Set the crawler configuration. If disabled, a crawler will be created.
     * @param config The configuration object
     */
    setCrawlerConfig(config: CrawlerConfiguration): void
    {
        if(!this.crawler) {
            this.components.crawler = new Crawler(this.bot, this.logger, config);
            this.components.crawler.boot();
        } else {
            this.crawler.reload(config);
        }
    }
}

export interface Components
{
    bot: Bot;
    eventHandler: MasterEventHandler,
    crawler?: Crawler,
    logger: Logger,
}