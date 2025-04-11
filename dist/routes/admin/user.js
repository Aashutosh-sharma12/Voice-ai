"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
const user_1 = __importDefault(require("../../controllers/admin/user"));
const http_status_codes_1 = require("http-status-codes");
const authValidator_1 = require("../../utils/authValidator");
const { OK, CREATED } = http_status_codes_1.StatusCodes;
const p = {
    listCategory: "/list",
    statusUpdate: "/updateStatus",
    details: "/details/:id"
};
userRouter.get(p.listCategory, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), async (req, res) => {
    const data = await user_1.default.listUser(req?.query, req?.headers);
    res.status(OK).json({ code: OK, data });
});
userRouter.patch(p.statusUpdate, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), async (req, res) => {
    console.log(req.body, "jsdfja");
    const data = await user_1.default.updateStatus(req?.body, req?.headers);
    res.status(OK).json({ data, code: OK });
});
userRouter.get(p.details, authValidator_1.verifyAuthToken, (0, authValidator_1.checkRole)(["admin"]), async (req, res) => {
    const data = await user_1.default.details(req?.params, req?.headers);
    res.status(OK).json({ code: OK, data });
});
exports.default = userRouter;
