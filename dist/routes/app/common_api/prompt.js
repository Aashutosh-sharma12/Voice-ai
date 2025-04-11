"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prompt_1 = __importDefault(require("../../../controllers/common_api/prompt"));
const schemaValidator_1 = require("../../../utils/schemaValidator");
const authValidator_1 = require("../../../utils/authValidator");
const prompt_2 = require("../../../validators/common/prompt");
const route = (0, express_1.Router)();
const p = {
    addPrompt: '/addPrompt',
    editPrompt: '/editPrompt',
    add_editContext_scope: '/add_editContext_scope',
    add_editExecution_requirement: '/add_editExecution_requirement',
    details: '/details/:id',
    list: '/list',
    deletePrompt: '/deletePrompt/:id',
    catList: '/catList',
    industryList: '/industryList/:id',
    knowledge_baseList: '/knowledge_baseList'
};
route.post(p.addPrompt, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(prompt_2.addPromptSchema), prompt_1.default.addPrompt);
route.put(p.editPrompt, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(prompt_2.editPromptSchema), prompt_1.default.editPrompt);
route.put(p.add_editContext_scope, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(prompt_2.add_editContext_scopeSchema), prompt_1.default.add_editContext_scope);
route.put(p.add_editExecution_requirement, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(prompt_2.add_editExecution_requirementSchema), prompt_1.default.add_editExecution_requirement);
route.get(p.details, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), prompt_1.default.promptDetails);
route.get(p.list, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), prompt_1.default.prompt_list);
route.delete(p.deletePrompt, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), prompt_1.default.deletePrompt);
route.get(p.catList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), prompt_1.default.catList);
route.get(p.industryList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), prompt_1.default.industryList);
route.get(p.knowledge_baseList, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), prompt_1.default.knowledge_baseList);
exports.default = route;
