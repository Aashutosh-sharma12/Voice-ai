"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const industoryRouter = (0, express_1.Router)();
const industory_1 = __importDefault(require("../../controllers/admin/industory"));
const http_status_codes_1 = require("http-status-codes");
const authValidator_1 = require("../../utils/authValidator");
const { OK, CREATED } = http_status_codes_1.StatusCodes;
const schemaValidator_1 = require("../../utils/schemaValidator");
const adminValidator_1 = require("../../validators/admin/adminValidator");
const p = {
    addIndustory: "/add",
    listIndustory: "/list",
    editIndustory: "/edit/:id",
    delete: "/delete/:id",
    statusUpdate: "/updateStatus",
    details: "/details/:id"
};
industoryRouter.post(p.addIndustory, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), (0, schemaValidator_1.schemaValidator)(adminValidator_1.IndValidator), async (req, res) => {
    const data = await industory_1.default.addIndustory(req?.body, req?.headers);
    res.status(CREATED).json({ code: CREATED, data });
});
industoryRouter.get(p.listIndustory, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), async (req, res) => {
    const data = await industory_1.default.listIndustory(req?.query, req?.headers);
    res.status(OK).json({ code: OK, data });
});
industoryRouter.patch(p.editIndustory, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), (0, schemaValidator_1.schemaValidator)(adminValidator_1.IndValidator), async (req, res) => {
    const data = await industory_1.default.editIndustory(req?.body, req?.params, req?.headers);
    res.status(OK).json({ data, code: OK });
});
industoryRouter.delete(p.delete, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), async (req, res) => {
    const data = await industory_1.default.deleteIndustory(req?.params, req?.headers);
    res.status(OK).json({ data, code: OK });
});
industoryRouter.patch(p.statusUpdate, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), 
// schemaValidator_forQueryReq(),
async (req, res) => {
    const data = await industory_1.default.updateStatus(req?.body, req?.headers);
    res.status(OK).json({ data, code: OK });
});
industoryRouter.get(p.details, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), async (req, res) => {
    const data = await industory_1.default.details(req?.params, req?.headers);
    res.status(OK).json({ code: OK, data });
});
exports.default = industoryRouter;
