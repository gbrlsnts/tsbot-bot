import { Crawl } from "./Crawl";
import { CrawlerChannel } from "./CrawlerTypes";

export class CrawlCompare {
    constructor(readonly previous: Crawl, readonly current: Crawl)
    {

    }

    /**
     * Get channels that are inactive starting from the current crawl
     */
    getNewInactiveChannels(): CrawlerChannel[]
    {
        if(this.previous.channels.length === 0)
            return [...this.current.channels];

        return this.current.channels.filter(curr => {
            // id can't be in previous crawls
            return this.previous.channels.every(prev => prev.channelId !== curr.channelId);
        })
    }

    /**
     * Get channels that are inactive already from the previous crawl
     */
    getRecurringInactive(): CrawlerChannel[]
    {
        if(this.previous.channels.length === 0)
            return [];
        
        return this.previous.channels.filter(prev => {
            return this.current.channels.find(curr => curr.channelId === prev.channelId);
        });
    }
    
    /**
     * Get channels that were inactive but are now active
     */
    getBackToActive(): CrawlerChannel[]
    {
        return this.previous.channels.filter(prev => {
            // notified and no longer in inactive list
            return prev.isNotified && this.current.channels.every(curr => curr.channelId !== prev.channelId);
        });
    }

    /**
     * Get all inactive channels
     */
    getInactiveChannels(): CrawlerChannel[]
    {
        return [...this.getRecurringInactive(), ...this.getNewInactiveChannels()];
    }

    /**
     * Get all inactive channels with inactive time added to them
     */
    getInactiveChannelsWithAddedTime(timeToAdd: number): CrawlerChannel[]
    {
        const recurringInactive = this.getRecurringInactive();

        recurringInactive.forEach(channel => {
            channel.timeInactive += timeToAdd;
            channel.lastUpdated = new Date();
        });

        return [...recurringInactive, ...this.getNewInactiveChannels()];
    }
}