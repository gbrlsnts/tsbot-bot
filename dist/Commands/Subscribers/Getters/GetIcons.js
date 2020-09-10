"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const Error_1 = require("../../../Bot/Error");
const SharedRules_1 = require("../../../Validation/SharedRules");
class GetIconsSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.icon.list';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = SharedRules_1.iconIds;
        this.bot = manager.bot;
    }
    getServerIdPosition() {
        return this.serverIdPos;
    }
    getSubject() {
        return this.subject;
    }
    getValidationSchema() {
        return this.schema;
    }
    async handle(msg) {
        let { data } = msg;
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        if (data.length === 0)
            data = await this.bot.getAllIconIds();
        const icons = await Promise.all(data.map(async (id) => ({
            iconId: id,
            content: (await this.bot.downloadIcon(id)).toString('base64'),
        })));
        return Library_1.right(icons);
    }
}
exports.GetIconsSubscriber = GetIconsSubscriber;
//# sourceMappingURL=GetIcons.js.map