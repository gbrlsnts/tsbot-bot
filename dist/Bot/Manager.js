"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Crawler_1 = require("./Crawler/Crawler");
class Manager {
    constructor(components) {
        this.components = components;
    }
    get bot() {
        return this.components.bot;
    }
    get eventHandler() {
        return this.components.eventHandler;
    }
    get crawler() {
        return this.components.crawler;
    }
    /**
     * Disables the crawler
     */
    disableCrawler() {
        var _a;
        (_a = this.crawler) === null || _a === void 0 ? void 0 : _a.stop();
        this.components.crawler = undefined;
    }
    /**
     * Set the crawler configuration. If disabled, a crawler will be created.
     * @param config The configuration object
     */
    setCrawlerConfig(config) {
        if (!this.crawler) {
            this.components.crawler = new Crawler_1.Crawler(this.bot, config);
            this.components.crawler.boot();
        }
        else {
            this.crawler.reload(config);
        }
    }
}
exports.default = Manager;
//# sourceMappingURL=Manager.js.map