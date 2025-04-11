"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../Custom_message/index"));
const category_1 = require("../../models/category");
const errors_1 = require("../../utils/errors");
const http_status_codes_1 = require("http-status-codes");
const moment_1 = __importDefault(require("moment"));
function addIndustory(body, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            body.lower_name = body.name.toLowerCase();
            const findIndustoryByName = await category_1.industryModel.findOne({
                isDelete: false,
                addBy: "admin",
                lower_name: body.lower_name,
            });
            if (findIndustoryByName) {
                reject(new errors_1.CustomError(index_1.default.AlreadyExist.replace("{{key1}}", 'Industory').replace("{{key2}}", `${body.name}`), http_status_codes_1.StatusCodes.BAD_REQUEST));
            }
            else {
                const resultData = await category_1.industryModel.create(body);
                if (resultData) {
                    resolve(resultData);
                }
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
function listIndustory(query, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { search, isActive, fromDate, toDate } = query;
            const page = parseInt(query?.page) || 1;
            const perPage = parseInt(query?.perPage) || 10;
            const skip = (page - 1) * perPage;
            let obj = {
                isDelete: false,
            };
            if (search && search !== "" && search !== undefined) {
                obj = {
                    ...obj,
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { lower_name: { $regex: search, $options: "i" } },
                    ],
                };
            }
            if (fromDate && toDate) {
                const fromDate1 = (0, moment_1.default)(fromDate).format('YYYY-MM-DD');
                const toDate1 = (0, moment_1.default)(toDate).format('YYYY-MM-DD');
                obj = {
                    ...obj,
                    createdAt: {
                        $gte: fromDate1,
                        $lte: toDate1
                    },
                };
            }
            if (isActive === "Active") {
                obj = { ...obj, isActive: true };
            }
            else if (isActive === "InActive") {
                obj = { ...obj, isActive: false };
            }
            else if (isActive === "all") {
                obj = { ...obj };
            }
            else {
                obj = { ...obj };
            }
            const totalDocument = await category_1.industryModel.countDocuments(obj);
            const findIndustory = await category_1.industryModel.aggregate([
                {
                    $match: obj,
                },
                {
                    $skip: skip,
                },
                {
                    $limit: perPage,
                },
                {
                    $sort: { createdAt: -1 }
                },
            ]);
            resolve({ totalCount: totalDocument, industory_data: findIndustory });
        }
        catch (error) {
            reject(error);
        }
    });
}
function editIndustory(body, params, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = params;
            body.lower_name = body.name.toLowerCase();
            const findCategory = await category_1.industryModel.findOne({
                lower_name: body.lower_name,
                addBy: "admin",
                isDelete: false,
                _id: {
                    $ne: id,
                },
            });
            if (findCategory) {
                reject(new errors_1.CustomError(index_1.default.AlreadyExist.replace("{{key1}}", 'Industory').replace("{{key2}}", `${body.name}`), http_status_codes_1.StatusCodes.BAD_REQUEST));
            }
            else {
                const update = await category_1.industryModel.findOneAndUpdate({ _id: id, isDelete: false }, {
                    name: body?.name,
                    lower_name: body?.lower_name,
                    isActive: body?.isActive,
                }, { new: true });
                resolve(update);
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
function updateStatus(body, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { isActive, id } = body;
            const updataeStatus = await category_1.industryModel.findOneAndUpdate({ _id: id, isDelete: false }, { isActive: isActive }, {
                new: true
            });
            if (updataeStatus) {
                resolve({ success: true });
            }
            else {
                reject(new errors_1.CustomError(index_1.default.noDatafoundWithID, http_status_codes_1.StatusCodes.NOT_FOUND));
            }
        }
        catch (error) {
            reject(error);
        }
        ;
    });
}
function deleteIndustory(params, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = params;
            const findIndustoryByID = await category_1.industryModel.findOneAndUpdate({ _id: id, isDelete: false }, {
                isDelete: true,
            }, {
                new: true,
            });
            if (!findIndustoryByID) {
                reject(new errors_1.CustomError(index_1.default.noDatafoundWithID, http_status_codes_1.StatusCodes.NOT_FOUND));
            }
            else {
                resolve({ success: true });
            }
        }
        catch (err) {
            reject(err);
        }
    });
}
function details(params, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = params;
            const findIndustoryById = await category_1.industryModel.findOne({
                _id: id,
                isDelete: false,
            });
            if (findIndustoryById) {
                resolve(findIndustoryById);
            }
            else {
                reject(new errors_1.CustomError(index_1.default.noDatafoundWithID, http_status_codes_1.StatusCodes.NOT_FOUND));
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.default = {
    addIndustory,
    listIndustory,
    editIndustory,
    updateStatus,
    deleteIndustory,
    details
};
