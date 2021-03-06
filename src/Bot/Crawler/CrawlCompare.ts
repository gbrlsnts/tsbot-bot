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
        if(this.previous.inactive.length === 0)
            return [...this.current.inactive];

        return this.current.inactive.filter(curr => {
            // id can't be in previous crawls
            return this.previous.inactive.every(prev => prev.channelId !== curr.channelId);
        })
    }

    /**
     * Get channels that are inactive already from the previous crawl
     */
    getRecurringInactive(): CrawlerChannel[]
    {
        if(this.previous.inactive.length === 0)
            return [];
        
        return this.previous.inactive.filter(prev => {
            return this.current.inactive.find(curr => curr.channelId === prev.channelId);
        });
    }
    
    /**
     * Get channels that were inactive but are now active
     */
    getBackToActive(): CrawlerChannel[]
    {
        return this.previous.inactive.filter(prev => {
            // notified and no longer in inactive list and still exists in the server
            return prev.isNotified &&
                this.current.inactive.every(curr => curr.channelId !== prev.channelId) &&
                this.current.active.find(curr => curr === prev.channelId);
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