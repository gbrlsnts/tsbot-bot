"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CrawlCompare {
    constructor(previous, current) {
        this.previous = previous;
        this.current = current;
    }
    /**
     * Get channels that are inactive starting from the current crawl
     */
    getNewInactiveChannels() {
        if (this.previous.inactive.length === 0)
            return [...this.current.inactive];
        return this.current.inactive.filter(curr => {
            // id can't be in previous crawls
            return this.previous.inactive.every(prev => prev.channelId !== curr.channelId);
        });
    }
    /**
     * Get channels that are inactive already from the previous crawl
     */
    getRecurringInactive() {
        if (this.previous.inactive.length === 0)
            return [];
        return this.previous.inactive.filter(prev => {
            return this.current.inactive.find(curr => curr.channelId === prev.channelId);
        });
    }
    /**
     * Get channels that were inactive but are now active
     */
    getBackToActive() {
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
    getInactiveChannels() {
        return [...this.getRecurringInactive(), ...this.getNewInactiveChannels()];
    }
    /**
     * Get all inactive channels with inactive time added to them
     */
    getInactiveChannelsWithAddedTime(timeToAdd) {
        const recurringInactive = this.getRecurringInactive();
        recurringInactive.forEach(channel => {
            channel.timeInactive += timeToAdd;
            channel.lastUpdated = new Date();
        });
        return [...recurringInactive, ...this.getNewInactiveChannels()];
    }
}
exports.CrawlCompare = CrawlCompare;
//# sourceMappingURL=CrawlCompare.js.map