import { TeamSpeakChannel } from "ts3-nodejs-library";

export class ChannelUtils {

    /**
     * Get all top level channels that are between 2 channels
     * @param start Start channel Id
     * @param end End channel Id
     */
    static getTopChannelsBetween(allChannels: TeamSpeakChannel[], start: number, end: number): ChannelsBetweenResult
    {
        let hasStart = false,
            hasEnd = false,
            channels: TeamSpeakChannel[] = [];

        for(let channel of allChannels) {
            if(channel.pid !== 0) {
                continue;
            }

            if(hasStart) {
                channels.push(channel);
            }

            if(channel.cid === start) {
                hasStart = true;
            }
                
            if(channel.cid === end) {
                hasEnd = true;
                break;
            }
        }

        return {
            hasStart,
            hasEnd,
            channels
        };
    }
}

export interface ChannelsBetweenResult {
    /** If the start was found in the specified range */
    hasStart: boolean,
    /** If the end was found in the specified range */
    hasEnd: boolean,
    /** The channels between start and end */
    channels: TeamSpeakChannel[]
}