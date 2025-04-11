"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const list_1 = __importDefault(require("../../../controllers/common_api/list"));
const schemaValidator_1 = require("../../../utils/schemaValidator");
const authValidator_1 = require("../../../utils/authValidator");
const list_2 = require("../../../validators/common/list");
const route = (0, express_1.Router)();
const p = {
    catList: '/catList',
    industryList: '/industryList',
    knowledge_baseList: '/knowledge_baseList',
    promptList: '/promptList',
    ai_providerList: '/ai_providerList',
    ai_modelList: '/ai_modelList/:id',
    transcription_providerList: '/transcription_providerList',
    transcription_modelList: '/transcription_modelList/:id',
    voice_providerList: '/voice_providerList',
    voice_modelList: '/voice_modelList/:id'
};
route.get(p.catList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), list_1.default.catList);
route.get(p.industryList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), list_1.default.industryList);
route.get(p.knowledge_baseList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), list_1.default.knowledge_baseList);
route.get(p.promptList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator_forQueryReq)(list_2.promptListSchema), list_1.default.promptList);
route.get(p.ai_providerList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), list_1.default.ai_providerList);
route.get(p.ai_modelList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), list_1.default.ai_modelList);
route.get(p.transcription_providerList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), list_1.default.transcription_providerList);
route.get(p.transcription_modelList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), list_1.default.transcription_modelList);
route.get(p.voice_providerList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), list_1.default.voice_providerList);
route.get(p.voice_modelList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), list_1.default.voice_modelList);
exports.default = route;
