"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const ChannelUtils_1 = require("../Utils/ChannelUtils");
class Crawler {
    constructor(bot, database, config) {
        this.bot = bot;
        this.database = database;
        this.config = config;
        this.bootTimer = 30;
        this.isBooted = false;
        this.isRunning = false;
    }
    boot() {
        if (this.isBooted)
            return;
        this.startTimer();
        this.isBooted = true;
    }
    reload(config) {
        // apply config and reload
    }
    startTimer() {
        if (this.timer)
            timers_1.clearTimeout(this.timer);
        this.timer = setTimeout(() => this.crawl.bind(this), this.getTimerInterval());
    }
    getTimerInterval() {
        if (this.isBooted)
            return this.config.interval * 1000;
        return this.bootTimer * 1000;
    }
    crawl() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isRunning = true;
            // fetch channel list, check time empty on channels per zone
            const channels = yield this.bot.getServer().channelList();
            this.config.zones.forEach(z => this.checkZoneChannels(z, channels));
            yield Promise.all(this.config.zones.map(z => this.checkZoneChannels(z, channels)))
                .catch(e => { throw e; });
            // grab all channels and trigger database update
            this.isRunning = false;
            this.startTimer();
        });
    }
    checkZoneChannels(zone, allChannels) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelsInZone = ChannelUtils_1.ChannelUtils.getTopChannelsBetween(allChannels, zone.start, zone.end);
            if (!channelsInZone.hasStart || !channelsInZone.hasEnd)
                throw new Error(`Unable to find start or end in zone ${zone.name}`);
            channelsInZone.channels.forEach(channel => {
                // need to check if tree has any client online
            });
            // return a list of channels with not empty or empty status
        });
    }
    updateState() {
        // update channels state in the database, cleanup if necessary
    }
    emitDeleteChannelEvent() {
        // emit event to delete the channel
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=Crawler.js.map