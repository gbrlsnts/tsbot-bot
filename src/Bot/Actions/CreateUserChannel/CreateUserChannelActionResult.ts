import { ActionResult } from "../ActionResult";
import { TeamSpeakChannel } from "ts3-nodejs-library";

export class CreateUserChannelActionResult implements ActionResult
{
    constructor(readonly channelList: TeamSpeakChannel[])
    {

    }

    getResultData(): TeamSpeakChannel[] {
        return this.channelList;
    }
}