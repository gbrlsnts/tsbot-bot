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
    constructor(bot, repository, config) {
        this.bot = bot;
        this.repository = repository;
        this.config = config;
        this.bootTimer = 30;
        this.isBooted = false;
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
        const interval = this.getTimerInterval();
        this.timer = setTimeout(this.crawl.bind(this), interval);
        console.log(`Next crawl to run in ${interval / 1000} seconds`);
    }
    getTimerInterval() {
        if (this.isBooted)
            return this.config.interval * 1000;
        return this.bootTimer * 1000;
    }
    crawl() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('starting crawl...');
            try {
                const channelList = yield this.bot.getServer().channelList();
                const emptyChannelList = [];
                this.config.zones.forEach(zone => {
                    emptyChannelList.push(...this.checkZoneChannels(zone, channelList));
                });
                console.log('Empty channels list:', emptyChannelList.map(c => c.name));
                this.updateChannelsState(emptyChannelList);
            }
            catch (e) {
                console.log(`Crawl error: ${e.message}`);
            }
            finally {
                this.startTimer();
                console.log('crawl ended');
            }
        });
    }
    checkZoneChannels(zone, allChannels) {
        const channelsInZone = ChannelUtils_1.ChannelUtils.getTopChannelsBetween(allChannels, zone.start, zone.end);
        if (!channelsInZone.hasStart || !channelsInZone.hasEnd)
            throw new Error(`Unable to find start or end in zone ${zone.name}`);
        return channelsInZone.channels
            .filter(channel => !ChannelUtils_1.ChannelUtils.isChannelSpacer(channel.name))
            .filter(channel => {
            const subTotalClients = ChannelUtils_1.ChannelUtils
                .getAllSubchannels(channel, allChannels)
                .map(sub => sub.totalClients)
                .reduce((accumulator, current) => accumulator + current);
            return channel.totalClients + subTotalClients === 0;
        });
    }
    updateChannelsState(channelList) {
        // get last crawl information
        // get channels in db 
        // add time between crawls to the empty times / initialize new empty channels
        // emit events for channels empty for too long
        // send empty channel list to repository
    }
    emitDeleteChannelEvent() {
        // emit event to delete the channel
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=Crawler.js.map