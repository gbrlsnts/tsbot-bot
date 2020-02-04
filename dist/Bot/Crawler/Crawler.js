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
                    const channelsInZone = ChannelUtils_1.ChannelUtils.getTopChannelsBetween(channelList, zone.start, zone.end);
                    if (!channelsInZone.hasStart || !channelsInZone.hasEnd)
                        throw new Error(`Unable to find start or end in zone ${zone.name}`);
                    const zoneEmptyChannels = channelsInZone.channels.filter(channel => {
                        return !ChannelUtils_1.ChannelUtils.isChannelSpacer(channel.name) &&
                            ChannelUtils_1.ChannelUtils.countChannelTreeTotalClients(channel, channelList) === 0;
                    });
                    emptyChannelList.push(...zoneEmptyChannels);
                });
                console.log('Empty channels list:', emptyChannelList.map(c => c.name));
                yield this.updateChannelsState(emptyChannelList);
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
    updateChannelsState(emptyChannelList) {
        return __awaiter(this, void 0, void 0, function* () {
            const prevCrawl = yield this.repository.getPreviousCrawl();
            const prevCrawlChannels = yield this.repository.getCrawlerEmptyChannels();
            if (prevCrawl) {
                const secondsFromPrevCrawl = (new Date().getMilliseconds() - prevCrawl.runAt.getMilliseconds()) / 1000;
                // filter out channels no longer in the empty list and then add empty time
                prevCrawlChannels.filter(prevChannel => {
                    return emptyChannelList.find(c => c.cid == prevChannel.channelId) !== undefined;
                })
                    .forEach(channel => channel.timeEmpty += secondsFromPrevCrawl);
            }
            // filter out channels in previous crawls and initialize empty time
            const newEmptyChannels = emptyChannelList.filter(emptyChannel => {
                return prevCrawlChannels.find(c => c.channelId == emptyChannel.cid) === undefined;
            })
                .map(channel => {
                return {
                    channelId: channel.cid,
                    timeEmpty: 0,
                    lastUpdated: new Date()
                };
            });
            const finalEmptyChannelList = [...prevCrawlChannels, ...newEmptyChannels];
            yield this.repository.setCrawlerEmptyChannels(finalEmptyChannelList);
            yield this.verifyChannelsToDelete(finalEmptyChannelList);
        });
    }
    verifyChannelsToDelete(empyChannelList) {
        // for each zone, check which exceed the time limit
        // delete or emit event for those that exceeded
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=Crawler.js.map