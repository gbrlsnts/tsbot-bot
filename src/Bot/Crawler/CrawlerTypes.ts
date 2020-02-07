export interface CrawlerChannel {
    /** Server channel Id */
    channelId: number;
    /** Time, in seconds, that this channel has been empty */
    timeEmpty: number;
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
    /** number of empty channels */
    emptyChannels: number;
    /** total channels */
    totalChannels: number;
}

export interface ZoneCrawlResult {
    /** the crawled zone */
    zone: string;
    /** empty channels id's */
    empty: number[];
    /** total number of channels, including non-empty */
    total: number;
}

export interface ZoneProcessResult {
    /** the crawled zone */
    zone: string;
    /** channels empty */
    channels: CrawlerChannel[];
}