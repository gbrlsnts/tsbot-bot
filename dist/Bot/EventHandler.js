"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventHandler {
    constructor(server) {
        this.server = server;
        this.registerEvents();
        this.registerClientConnectHandler();
        this.registerTextMessageHandler();
    }
    registerEvents() {
        Promise.all([
            this.server.registerEvent("server"),
            this.server.registerEvent("channel", 0),
            this.server.registerEvent("textserver"),
            this.server.registerEvent("textchannel"),
            this.server.registerEvent("textprivate")
        ]);
    }
    registerClientConnectHandler() {
        this.server.on('clientconnect', event => {
            console.log('Client Connect', event);
        });
    }
    registerTextMessageHandler() {
        this.server.on('textmessage', event => {
            console.log('Server Event', event);
        });
    }
}
exports.EventHandler = EventHandler;
//# sourceMappingURL=EventHandler.js.map