"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const baseRoute = (0, express_1.Router)();
const knowledge_base_1 = __importDefault(require("./knowledge_base"));
const prompt_1 = __importDefault(require("./prompt"));
const list_1 = __importDefault(require("./list"));
const agent_1 = __importDefault(require("./agent"));
baseRoute.use('/knowledge_base', knowledge_base_1.default);
baseRoute.use('/prompt', prompt_1.default);
baseRoute.use('/list', list_1.default);
baseRoute.use('/agent', agent_1.default);
exports.default = baseRoute;
