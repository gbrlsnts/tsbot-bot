import { ConnectionProtocol } from '../Types';

export interface Configuration {
    /** server identifier, should be unique */
    id: number;
    /** Server connection configurations */
    connection: ConnectionConfiguration;

    /** Crawler configurations */
    crawler?: CrawlerConfiguration;
}

export interface ConnectionConfiguration {
    /** Host to connect to */
    host: string;
    /** Query port */
    queryport: number;
    /** Voice port */
    serverport: number;
    /** Query protocol */
    protocol: ConnectionProtocol;
    /** Username to login with */
    username?: string;
    /** Password to use in login */
    password?: string;
    /** Nickname of the bot */
    nickname: string;
}

export interface CrawlerConfiguration {
    /** Interval in seconds that the bot should crawl the server */
    interval: number;
    /** A list of zones with user channels that should be monitored */
    zones: CrawlZone[];
}

export interface CrawlZone {
    /** Zone name */
    name: string;
    /** Flag for when the zone is configured to have a spacer as separator between zones */
    spacerAsSeparator: boolean;
    /** Zone start channel Id */
    start: number;
    /** Zone end channel Id */
    end: number;
    /** Icon name for inactive channels */
    inactiveIcon?: number;
    /** Time in seconds a channel can be inactive before triggering a notification */
    timeInactiveNotify: number;
    /** Time in seconds a channel can be inactive before it is deleted */
    timeInactiveMax: number;
}
