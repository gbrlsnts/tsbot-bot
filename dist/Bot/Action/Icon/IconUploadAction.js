"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const Error_1 = require("../../Error");
class IconUploadAction {
    constructor(bot, data) {
        this.bot = bot;
        this.data = data;
    }
    /**
     * Execute the action
     */
    async execute() {
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        const iconId = await this.bot.uploadIcon(this.data.icon);
        return Library_1.right(iconId);
    }
}
exports.default = IconUploadAction;
//# sourceMappingURL=IconUploadAction.js.map