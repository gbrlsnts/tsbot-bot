"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const Error_1 = require("../../../Bot/Error");
const SharedRules_1 = require("../../../Validation/SharedRules");
class GetIconsSubscriber {
    constructor() {
        this.subject = 'bot.server.*.icon.list';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = SharedRules_1.iconIds;
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
    async handle(botManager, msg) {
        let { data } = msg;
        if (!botManager.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        if (data.length === 0)
            data = await botManager.bot.getAllIconIds();
        const icons = await Promise.all(data.map(async (id) => ({
            iconId: id,
            content: (await botManager.bot.downloadIcon(id)).toString('base64'),
        })));
        return Library_1.right(icons);
    }
}
exports.GetIconsSubscriber = GetIconsSubscriber;
//# sourceMappingURL=GetIcons.js.map