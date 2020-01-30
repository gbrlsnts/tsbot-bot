"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateUserChannelActionResult {
    constructor(channelList) {
        this.channelList = channelList;
    }
    getResultData() {
        const channel = this.channelList[0].cid;
        const subchannels = this.channelList.slice(1).map(c => c.cid);
        return {
            channel,
            subchannels,
        };
    }
}
exports.CreateUserChannelActionResult = CreateUserChannelActionResult;
//# sourceMappingURL=CreateUserChannelActionResult.js.map