"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../Custom_message/index"));
const user_1 = __importDefault(require("../../models/user"));
const errors_1 = require("../../utils/errors");
const http_status_codes_1 = require("http-status-codes");
const moment_1 = __importDefault(require("moment"));
function listUser(query, headers) {
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
                        { email: { $regex: search, $options: "i" } },
                        { phoneNumber: { $regex: search, $options: "i" } }
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
            const [UserData, Count] = await Promise.all([user_1.default.find(obj, { isDelete: false }).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage), user_1.default.countDocuments(obj)]);
            resolve({ totalCount: Count, user_data: UserData });
        }
        catch (error) {
            reject(error);
        }
    });
}
function details(params, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = params;
            const findUserById = await user_1.default.findOne({
                _id: id,
                isDelete: false,
            });
            if (findUserById) {
                resolve(findUserById);
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
function updateStatus(body, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { isActive, id } = body;
            const updataeStatus = await user_1.default.findOneAndUpdate({ _id: id, isDelete: false }, { isActive: isActive }, { new: true });
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
    });
}
exports.default = {
    listUser,
    details,
    updateStatus
};
