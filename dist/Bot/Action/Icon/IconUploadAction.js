"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
class IconUploadAction {
    constructor(bot, data) {
        this.bot = bot;
        this.data = data;
    }
    /**
     * Execute the action
     */
    async execute() {
        await this.bot.uploadIcon(this.data.icon);
        return Library_1.right(true);
    }
}
exports.default = IconUploadAction;
//# sourceMappingURL=IconUploadAction.js.map