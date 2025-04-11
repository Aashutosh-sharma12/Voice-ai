"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agent_1 = __importDefault(require("../../../controllers/common_api/agent"));
const schemaValidator_1 = require("../../../utils/schemaValidator");
const authValidator_1 = require("../../../utils/authValidator");
const agent_2 = require("../../../validators/common/agent");
const route = (0, express_1.Router)();
const p = {
    addBasicInfo: '/addBasicInfo',
    editBasicInfo: '/editBasicInfo',
    add_editAI_configuration: '/add_editAI_configuration',
    add_editTranscription_configuration: '/add_editTranscription_configuration',
    add_editVoice_configuration: '/add_editVoice_configuration',
    add_editFunction_configuration: '/add_editFunction_configuration',
    add_editAdvance_configuration: '/add_editAdvance_configuration',
    agentDetails: '/agentDetails/:id',
    agentList: '/agentList',
    deleteAgent: '/deleteAgent/:id'
};
route.post(p.addBasicInfo, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(agent_2.addBasicInfoSchema), agent_1.default.addBasicInfo);
route.put(p.editBasicInfo, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(agent_2.editBasicInfoSchema), agent_1.default.editBasicInfo);
route.put(p.add_editAI_configuration, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(agent_2.ai_configurationSchema), agent_1.default.add_editAI_configuration);
route.put(p.add_editTranscription_configuration, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(agent_2.transcription_configurationSchema), agent_1.default.add_editTranscription_configuration);
route.put(p.add_editVoice_configuration, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(agent_2.voice_configurationSchema), agent_1.default.add_editVoice_configuration);
route.put(p.add_editFunction_configuration, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(agent_2.function_configurationSchema), agent_1.default.add_editFunction_configuration);
route.put(p.add_editAdvance_configuration, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(agent_2.advance_configurationSchema), agent_1.default.add_editAdvance_configuration);
route.get(p.agentDetails, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), agent_1.default.agentDetails);
route.get(p.agentList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), agent_1.default.agentList);
route.delete(p.deleteAgent, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), agent_1.default.deleteAgent);
exports.default = route;
