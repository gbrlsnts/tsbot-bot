"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const IconUploadAction_1 = __importDefault(require("../../../Bot/Action/Icon/IconUploadAction"));
class IconUploadSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.icon.upload';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = joi_1.default.string().required().base64();
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
    handle(msg) {
        return new IconUploadAction_1.default(this.manager.bot, {
            icon: Buffer.from(msg.data, 'base64'),
        }).execute();
    }
}
exports.IconUploadSubscriber = IconUploadSubscriber;
//# sourceMappingURL=IconUpload.js.map