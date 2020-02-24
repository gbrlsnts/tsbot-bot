export interface CrawlerChannel {
    /** Server channel Id */
    channelId: number;
    /** Time, in seconds, that this channel has been inactive */
    timeInactive: number;
    /** True, if a notification was sent regarding inactivity */
    isNotified: boolean;
    /** Date of when the channel data was last updated */
    lastUpdated: Date;
}

export interface CrawlInfo {
    /** Runtime date of the crawler */
    runAt: Date;
    /** Info on the crawled zones */
    zones: CrawlZoneInfo[];
}

export interface CrawlZoneInfo {
    /** the crawled zone */
    zone: string;
    /** number of inactive channels */
    inactiveChannels: number;
    /** total channels */
    totalChannels: number;
}

export interface ZoneCrawlResult {
    /** the crawled zone */
    zone: string;
    /** inactive channels id's */
    inactive: number[];
    /** active channels id's */
    active: number[];
    /** total number of channels, including active */
    total: number;
}

export interface ZoneProcessResult {
    /** the crawled zone */
    zone: string;
    /** contains all, unfiltered, inactive channels in the zone */
    channels: CrawlerChannel[];
    /** channels that have returned to active but were previously notified */
    activeNotifiedChannels: CrawlerChannel[];
    /** inactive channels that should be notified */
    toNotify: CrawlerChannel[];
    /** inactive channels that should be deleted */
    toDelete: CrawlerChannel[];
}