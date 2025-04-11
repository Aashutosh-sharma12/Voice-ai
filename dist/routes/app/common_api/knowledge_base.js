"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const knowledge_base_1 = __importDefault(require("../../../controllers/common_api/knowledge_base"));
const schemaValidator_1 = require("../../../utils/schemaValidator");
const authValidator_1 = require("../../../utils/authValidator");
const knowledge_base_2 = require("../../../validators/common/knowledge_base");
const multer_1 = require("../../../utils/multer");
const route = (0, express_1.Router)();
const p = {
    addKnowledge_base_content: '/addKnowledge_base_content',
    deleteKnowledge_base_content: '/deleteKnowledge_base_content',
    list: '/list'
};
route.post(p.addKnowledge_base_content, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), multer_1.upload.fields([{ name: 'file', maxCount: 5 }]), multer_1.checkFileSize, multer_1.uploadMultiple_images, (0, schemaValidator_1.schemaValidator_forQueryReq)(knowledge_base_2.knowledge_baseSchema), knowledge_base_1.default.addKnowledge_base_content);
route.patch(p.deleteKnowledge_base_content, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), (0, schemaValidator_1.schemaValidator)(knowledge_base_2.delete_baseSchema), knowledge_base_1.default.deleteKnowledge_base_content);
route.get(p.list, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user', 'admin']), knowledge_base_1.default.list);
exports.default = route;
