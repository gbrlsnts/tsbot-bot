export interface CrawlerChannel {
    /** Server channel Id */
    channelId: number;
    /** Time, in seconds, that this channel has been empty */
    timeEmpty: number;
    /** Date of when the channel data was last updated */
    lastUpdated: Date;
}