"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const index_1 = __importDefault(require("../../Custom_message/index"));
const index_2 = require("../../models/index");
const errors_1 = require("../../utils/errors");
const helpers_1 = require("../../utils/helpers");
const http_status_codes_1 = require("http-status-codes");
const { OK, CREATED } = http_status_codes_1.StatusCodes;
const addKnowledge_base_content = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const fileUrls = req.files;
        const results = [];
        if (!fileUrls || !fileUrls.length) {
            throw new errors_1.CustomError(index_1.default.fileUploadError, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        for (const file of fileUrls) {
            let body = {
                fileUrl: file,
                uploadBy: role
            };
            if (role == 'user') {
                body = {
                    ...body,
                    userId: id,
                };
            }
            const convertToJSONFromUrl = await (0, helpers_1.convertToJsonFromUrl)(file);
            body.file_content = convertToJSONFromUrl;
            const data = await index_2.knowledge_baseModel.create(body);
            results.push(data);
        }
        ;
        res.status(CREATED).json({ data: results, code: CREATED });
    }
    catch (err) {
        next(err);
    }
};
const deleteKnowledge_base_content = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const { knowledge_baseIds, deleteAll } = req.body;
        let cond = {
            _id: knowledge_baseIds,
            isDelete: false
        };
        if (role == 'user') {
            cond = {
                ...cond,
                userId: id,
            };
        }
        if (deleteAll) {
            cond = {
                isDelete: false
            };
        }
        const data = await index_2.knowledge_baseModel.updateMany(cond, { isDelete: true });
        if (data) {
            res.status(OK).json({ data: { success: true }, code: OK });
        }
        else {
            throw new errors_1.CustomError(index_1.default.noDatafound, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
    }
    catch (err) {
        next(err);
    }
};
const list = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const { page = 1, perPage = 10 } = req.query;
        let cond = {
            isDelete: false,
            isActive: true
        };
        if (role == 'user') {
            cond = {
                ...cond,
                $or: [
                    { userId: id },
                    {
                        uploadBy: {
                            $in: ['admin']
                        }
                    }
                ]
            };
        }
        const [list, count] = await Promise.all([
            index_2.knowledge_baseModel.find(cond).sort({ createdAt: -1 }).skip(Number(perPage * page) - Number(perPage)).limit(Number(perPage)),
            index_2.knowledge_baseModel.countDocuments(cond)
        ]);
        res.status(OK).json({ itemList: list, totalCount: count, code: OK });
    }
    catch (err) {
        next(err);
    }
};
module.exports = {
    addKnowledge_base_content,
    deleteKnowledge_base_content,
    list
};
