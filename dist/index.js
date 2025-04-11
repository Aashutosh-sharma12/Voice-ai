"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./pre-start"); // Must be the first import
const server_1 = __importDefault(require("./server"));
const { createServer } = require("http");
// Constants
const serverStartMsg = "Express server started on port: ", port = process.env.PORT || 3000;
const httpServer = createServer(server_1.default);
// Start serverqqqqq
httpServer.listen(port, (req, res) => {
    console.log(serverStartMsg + port);
});
