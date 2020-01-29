import { ActionResult } from "../ActionResult";
import { TeamSpeakChannel } from "ts3-nodejs-library";

export class CreateUserChannelActionResult implements ActionResult
{
    constructor(readonly channelList: TeamSpeakChannel[])
    {

    }

    getResultData(): CreateUserChannelResultData {
        const channel = this.channelList[0].cid;
        const subchannels = this.channelList.slice(1).map(c => c.cid);

        return {
            channel,
            subchannels,
        }
    }
}

export interface CreateUserChannelResultData {
    /** Id of the newly created top channel */
    channel: number;
    /** Ids of channel's subchannels */
    subchannels: number[];
}