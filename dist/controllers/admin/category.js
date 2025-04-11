"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../Custom_message/index"));
const category_1 = require("../../models/category");
const errors_1 = require("../../utils/errors");
const http_status_codes_1 = require("http-status-codes");
function addCategory(body, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            body.lower_name = body.name.toLowerCase();
            const findCategoryByName = await category_1.categoryModel.findOne({
                isDelete: false,
                addBy: "admin",
                lower_name: body.lower_name,
            });
            if (findCategoryByName) {
                reject(new errors_1.CustomError(index_1.default.AlreadyExist.replace("{{key1}}", 'Category').replace("{{key2}}", `${body.name}`), http_status_codes_1.StatusCodes.BAD_REQUEST));
            }
            else {
                const resultData = await category_1.categoryModel.create(body);
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
function listCategory(query, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { search, isActive } = query;
            const page = parseInt(query?.page) || 1;
            const perPage = parseInt(query?.perPage) || 10;
            let obj = {
                isDelete: false
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
            const [CategoryData, Count] = await Promise.all([category_1.categoryModel.find(obj, { isDelete: false }).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage), category_1.categoryModel.countDocuments(obj)]);
            resolve({ totalCount: Count, category_data: CategoryData });
        }
        catch (error) {
            reject(error);
        }
    });
}
function editCategory(body, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = body;
            body.lower_name = body.name.toLowerCase();
            const findCategory = await category_1.categoryModel.findOne({
                lower_name: body.lower_name,
                addBy: "admin",
                isDelete: false,
                _id: {
                    $ne: id,
                },
            });
            if (findCategory) {
                reject(new errors_1.CustomError(index_1.default.AlreadyExist.replace("{{key1}}", 'Category').replace("{{key2}}", `${body.name}`), http_status_codes_1.StatusCodes.BAD_REQUEST));
            }
            else {
                const update = await category_1.categoryModel.findOneAndUpdate({ _id: id, isDelete: false }, {
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
            const updataeStatus = await category_1.categoryModel.findOneAndUpdate({ _id: id, isDelete: false }, { isActive: isActive }, { new: true });
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
function deleteCategory(params, headers) {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = params;
            const findCategoryByID = await category_1.categoryModel.findOneAndUpdate({ _id: id, isDelete: false }, {
                isDelete: true,
            }, {
                new: true,
            });
            if (!findCategoryByID) {
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
            const findCategoryById = await category_1.categoryModel.findOne({
                _id: id,
                isDelete: false,
            });
            if (findCategoryById) {
                resolve(findCategoryById);
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
    addCategory,
    listCategory,
    editCategory,
    updateStatus,
    deleteCategory,
    details
};
