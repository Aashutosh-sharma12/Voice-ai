"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../controllers/admin/auth"));
const http_status_codes_1 = require("http-status-codes");
const schemaValidator_1 = require("../../utils/schemaValidator");
const adminValidator_1 = require("../../validators/admin/adminValidator");
const authRoute = (0, express_1.Router)();
const { OK, CREATED } = http_status_codes_1.StatusCodes;
const p = {
    add: "/addAdmin",
    login: "/login",
};
authRoute.post(p.add, (0, schemaValidator_1.schemaValidator)(adminValidator_1.adminSignup), async (req, res) => {
    const data = await auth_1.default.adminSignup(req.body, req.headers);
    res.status(CREATED).json({ data, code: CREATED });
});
authRoute.post(p.login, (0, schemaValidator_1.schemaValidator)(adminValidator_1.adminLogin), async (req, res) => {
    const data = await auth_1.default.adminLogin(req.body, req.headers);
    res.status(OK).json({ code: OK, data });
});
exports.default = authRoute;
