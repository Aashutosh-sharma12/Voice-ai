"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const add_1 = __importDefault(require("../../../controllers/user/add"));
const schemaValidator_1 = require("../../../utils/schemaValidator");
const authValidator_1 = require("../../../utils/authValidator");
const add_2 = require("../../../validators/user/add");
const route = (0, express_1.Router)();
const p = {
    addCategory: '/addCategory',
    addIndustry: '/addIndustry',
};
route.post(p.addCategory, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user']), (0, schemaValidator_1.schemaValidator)(add_2.catSchema), add_1.default.addCategory);
route.post(p.addIndustry, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(['user']), (0, schemaValidator_1.schemaValidator)(add_2.industrySchema), add_1.default.addIndustry);
exports.default = route;
