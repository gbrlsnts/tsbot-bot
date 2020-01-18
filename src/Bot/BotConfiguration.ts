import { ConnectionProtocol } from "./ConnectionProtocol";

export interface BotConfiguration {
    /** Host to connect to */
    host: string;
    /** Query port */
    queryport: number;
    /** Voice port */
    serverport: number;
    /** Query protocol */
    protocol: ConnectionProtocol
    /** Username to login with */
    username?: string;
    /** Password to use in login */
    password?: string;
    /** Nickname of the bot */
    nickname: string;
}