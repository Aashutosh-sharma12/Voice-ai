"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const index_1 = __importDefault(require("../../Custom_message/index"));
const index_2 = require("../../models/index");
const errors_1 = require("../../utils/errors");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const { CREATED } = http_status_codes_1.default;
const addCategory = async (req, res, next) => {
    try {
        const { role, id } = req.user;
        const { name } = req.body;
        const lower_name = name.toLowerCase();
        let cond = {
            isDelete: false,
            lower_name: lower_name,
            $or: [
                { userId: id },
                { addBy: 'admin' }
            ]
        };
        const check = await index_2.categoryModel.findOne(cond);
        if (check) {
            throw new errors_1.CustomError(index_1.default.AlreadyExist.replace("{{key1}}", 'Category').replace("{{key2}}", name), http_status_codes_1.default.BAD_REQUEST);
        }
        else {
            req.body = {
                ...req.body,
                userId: id,
                addBy: role,
                lower_name: lower_name
            };
            const add = await index_2.categoryModel.create(req.body);
            res.status(CREATED).json({ code: CREATED, data: add });
        }
    }
    catch (err) {
        next(err);
    }
};
const addIndustry = async (req, res, next) => {
    try {
        const { role, id } = req.user;
        const { name } = req.body;
        const lower_name = name.toLowerCase();
        let cond = {
            isDelete: false,
            lower_name: lower_name,
            $or: [
                { userId: id },
                { addBy: 'admin' }
            ]
        };
        const check = await index_2.industryModel.findOne(cond);
        if (check) {
            throw new errors_1.CustomError(index_1.default.AlreadyExist.replace("{{key1}}", 'Industry').replace("{{key2}}", name), http_status_codes_1.default.BAD_REQUEST);
        }
        else {
            req.body = {
                ...req.body,
                userId: id,
                addBy: role,
                lower_name: lower_name
            };
            const add = await index_2.industryModel.create(req.body);
            res.status(CREATED).json({ code: CREATED, data: add });
        }
    }
    catch (err) {
        next(err);
    }
};
module.exports = {
    addCategory,
    addIndustry
};
