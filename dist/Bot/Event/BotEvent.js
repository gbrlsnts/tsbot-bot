"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class BotEvent extends events_1.EventEmitter {
    raiseChannelNotInactiveNotify(channelId, zone) {
        this.emit(BotEventName.channelInactiveNotifyEvent, { channelId, zone });
    }
    raiseChannelInactiveNotify(channelId, zone, icon) {
        this.emit(BotEventName.channelInactiveNotifyEvent, { channelId, zone, icon });
    }
    raiseChannelInactiveDelete(channelId, zone) {
        this.emit(BotEventName.channelInactiveDeleteEvent, { channelId, zone });
    }
}
exports.BotEvent = BotEvent;
class BotEventName {
}
exports.BotEventName = BotEventName;
BotEventName.channelNotInactiveNotifyEvent = 'bot.user.channel.not-inactive.notify';
BotEventName.channelInactiveNotifyEvent = 'bot.user.channel.inactive.notify';
BotEventName.channelInactiveDeleteEvent = 'bot.user.channel.delete.notify';
//# sourceMappingURL=BotEvent.js.map