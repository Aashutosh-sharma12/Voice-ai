"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryRouter = (0, express_1.Router)();
const category_1 = __importDefault(require("../../controllers/admin/category"));
const http_status_codes_1 = require("http-status-codes");
const authValidator_1 = require("../../utils/authValidator");
const { OK, CREATED } = http_status_codes_1.StatusCodes;
const schemaValidator_1 = require("../../utils/schemaValidator");
const adminValidator_1 = require("../../validators/admin/adminValidator");
const p = {
    addCategory: "/add",
    listCategory: "/list",
    editCategory: "/edit",
    delete: "/delete/:id",
    statusUpdate: "/updateStatus",
    details: "/details/:id"
};
categoryRouter.post(p.addCategory, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), (0, schemaValidator_1.schemaValidator)(adminValidator_1.CatValidator), async (req, res) => {
    const data = await category_1.default.addCategory(req?.body, req?.headers);
    res.status(CREATED).json({ code: CREATED, data });
});
categoryRouter.get(p.listCategory, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), async (req, res) => {
    console.log(req.search);
    const data = await category_1.default.listCategory(req?.query, req?.headers);
    res.status(OK).json({ code: OK, data });
});
categoryRouter.patch(p.editCategory, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), (0, schemaValidator_1.schemaValidator)(adminValidator_1.editCatValidator), async (req, res) => {
    const data = await category_1.default.editCategory(req?.body, req?.headers);
    res.status(OK).json({ data, code: OK });
});
categoryRouter.delete(p.delete, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), async (req, res) => {
    const data = await category_1.default.deleteCategory(req?.params, req?.headers);
    res.status(OK).json({ data, code: OK });
});
categoryRouter.patch(p.statusUpdate, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), 
// schemaValidator_forQueryReq(),
async (req, res) => {
    const data = await category_1.default.updateStatus(req?.body, req?.headers);
    res.status(OK).json({ data, code: OK });
});
categoryRouter.get(p.details, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), async (req, res) => {
    const data = await category_1.default.details(req?.params, req?.headers);
    res.status(OK).json({ code: OK, data });
});
exports.default = categoryRouter;
