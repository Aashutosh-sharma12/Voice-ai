"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const index_1 = __importDefault(require("../../Custom_message/index"));
const category_1 = require("../../models/category");
const index_2 = require("../../models/index");
const errors_1 = require("../../utils/errors");
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const { OK, CREATED } = http_status_codes_1.StatusCodes;
const addPrompt = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const { step1_draftStatus } = req.body;
        let body_obj = {
            ...req.body,
            addBy: role,
            step1_status: step1_draftStatus === true ? false : true
        };
        if (role == 'user') {
            body_obj = {
                ...body_obj,
                userId: id
            };
        }
        const add = await index_2.promptModel.create(body_obj);
        res.status(CREATED).json({ data: add, code: CREATED });
    }
    catch (err) {
        next(err);
    }
};
const editPrompt = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const { step1_draftStatus, promptId } = req.body;
        let body_obj = {
            ...req.body,
            step1_status: step1_draftStatus === true ? false : true
        };
        let cond = {
            _id: promptId,
            addBy: role
        };
        if (role == 'user') {
            body_obj = {
                ...body_obj,
                userId: id
            };
            cond = {
                ...cond,
                userId: id
            };
        }
        const findAndUpdate = await index_2.promptModel.findOneAndUpdate(cond, body_obj, { new: true });
        res.status(CREATED).json({ data: findAndUpdate, code: CREATED });
    }
    catch (err) {
        next(err);
    }
};
const add_editContext_scope = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const { step2_draftStatus, promptId } = req.body;
        let cond_obj = {
            _id: promptId
        };
        if (role == 'user') {
            cond_obj = {
                ...cond_obj,
                userId: id
            };
        }
        let body = {
            ...req.body,
            step2_status: step2_draftStatus === true ? false : true
        };
        const promptDetails = await index_2.promptModel.findOneAndUpdate(cond_obj, body, { new: true });
        if (promptDetails) {
            res.status(CREATED).json({ data: promptDetails, code: CREATED });
        }
        else {
            throw new errors_1.CustomError(index_1.default.noDatafound, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
    }
    catch (err) {
        next(err);
    }
};
const add_editExecution_requirement = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const { step3_draftStatus, promptId, task_details, prompt_task_structure_details } = req.body;
        let cond_obj = {
            _id: promptId
        };
        if (role == 'user') {
            cond_obj = {
                ...cond_obj,
                userId: id
            };
        }
        let body = {
            ...req.body,
            step3_status: step3_draftStatus === true ? false : true
        };
        const promptDetails = await index_2.promptModel.findOne(cond_obj, { addBy: 1 });
        if (promptDetails) {
            if (task_details.length) {
                task_details.forEach(async (item) => {
                    item.promptId = promptId;
                    item.userId = id;
                    if (item.isDelete === true) {
                        await index_2.prompt_taskModel.updateOne({ _id: item._id }, { isDelete: true });
                    }
                    if (item._id && item._id != '') {
                        await index_2.prompt_taskModel.updateOne({ _id: item._id }, item);
                    }
                    else {
                        delete item._id;
                        await index_2.prompt_taskModel.create(item);
                    }
                });
            }
            if (prompt_task_structure_details.length) {
                prompt_task_structure_details.forEach(async (item) => {
                    item.promptId = promptId;
                    item.userId = id;
                    if (item.isDelete === true) {
                        await index_2.prompt_task_structureModel.updateOne({ _id: item._id }, { isDelete: true });
                    }
                    if (item._id && item._id != '') {
                        await index_2.prompt_task_structureModel.updateOne({ _id: item._id }, item);
                    }
                    else {
                        delete item._id;
                        await index_2.prompt_task_structureModel.create(item);
                    }
                });
            }
            await index_2.promptModel.updateOne(cond_obj, body);
            res.status(CREATED).json({ data: { success: true }, code: CREATED });
        }
        else {
            throw new errors_1.CustomError(index_1.default.noDatafound, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
    }
    catch (err) {
        next(err);
    }
};
const promptDetails = async (req, res, next) => {
    try {
        const promptId = req.params.id;
        const promptDetails = await index_2.promptModel.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(promptId), isDelete: false
                }
            },
            {
                $lookup: {
                    from: "prompt_tasks",
                    foreignField: "promptId",
                    localField: "_id",
                    as: "prompt_tasksList",
                    pipeline: [
                        {
                            $match: { isDelete: false }
                        },
                        {
                            $project: {
                                task_description: 1,
                                isDelete: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "prompt_task_structures",
                    foreignField: "promptId",
                    localField: "_id",
                    as: "prompt_task_structureList",
                    pipeline: [
                        {
                            $match: { isDelete: false }
                        },
                        {
                            $project: {
                                prompt_task_structure: 1,
                                isDelete: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "knowledge_bases",
                    foreignField: "_id",
                    localField: "knowledge_baseId",
                    as: "knowledge_basesDetails",
                    pipeline: [
                        {
                            $project: {
                                fileUrl: 1,
                                isDelete: 1,
                                uploadBy: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$knowledge_basesDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    knowledge_basesDetails: { $ifNull: ["$knowledge_basesDetails", {}] }
                }
            },
            {
                $project: {
                    knowledge_baseId: 0
                }
            }
        ]);
        res.status(OK).json({ data: promptDetails.length ? promptDetails[0] : {}, code: OK });
    }
    catch (err) {
        next(err);
    }
};
const prompt_list = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, search, filterId } = req.query;
        let cond = {
            isDelete: false, isActive: true
        };
        if (search) {
            cond = {
                ...cond,
                title: { $regex: search, $options: 'i' }
            };
        }
        if (filterId) {
            cond = {
                ...cond,
                $or: [
                    { categoryId: new mongoose_1.default.Types.ObjectId(filterId) },
                    { industriesId: new mongoose_1.default.Types.ObjectId(filterId) }
                ]
            };
        }
        const [list, count] = await Promise.all([
            index_2.promptModel.aggregate([
                {
                    $match: cond
                },
                {
                    $lookup: {
                        from: "prompt_tasks",
                        foreignField: "promptId",
                        localField: "_id",
                        as: "prompt_tasksList",
                        pipeline: [
                            {
                                $match: { isDelete: false }
                            },
                            {
                                $project: {
                                    task_description: 1,
                                    isDelete: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "prompt_task_structures",
                        foreignField: "promptId",
                        localField: "_id",
                        as: "prompt_task_structureList",
                        pipeline: [
                            {
                                $match: { isDelete: false }
                            },
                            {
                                $project: {
                                    prompt_task_structure: 1,
                                    isDelete: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "knowledge_bases",
                        foreignField: "_id",
                        localField: "knowledge_baseId",
                        as: "knowledge_basesDetails",
                        pipeline: [
                            {
                                $project: {
                                    fileUrl: 1,
                                    isDelete: 1,
                                    uploadBy: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: {
                        path: "$knowledge_basesDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        knowledge_basesDetails: { $ifNull: ["$knowledge_basesDetails", {}] }
                    }
                },
                {
                    $project: {
                        knowledge_baseId: 0
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $skip: Number(page * perPage) - Number(perPage)
                },
                {
                    $limit: Number(perPage)
                }
            ]),
            index_2.promptModel.aggregate([
                {
                    $match: cond
                },
                {
                    $count: "totalCount"
                }
            ])
        ]);
        res.status(OK).json({ itemList: list, totalCount: count.length ? count[0].totalCount : 0, code: OK });
    }
    catch (err) {
        next(err);
    }
};
const deletePrompt = async (req, res, next) => {
    try {
        const promptId = req.params.id;
        const findAndDelete = await index_2.promptModel.findOneAndUpdate({ _id: promptId }, { isDelete: true }, { new: true, fields: { isDelete: 1, addBy: 1 } });
        if (findAndDelete) {
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
const catList = async (req, res, next) => {
    try {
        const cond = {
            isDelete: false,
            isActive: true
        };
        const list = await index_2.categoryModel.aggregate([
            {
                $match: cond
            },
            {
                $lookup: {
                    from: "industries",
                    foreignField: "catId",
                    localField: "_id",
                    as: "industries_List",
                    pipeline: [
                        {
                            $match: cond
                        }
                    ]
                }
            },
            {
                $match: { "industries_List": { $ne: [] } }
            }
        ]);
        res.status(OK).json({ itemList: list, code: OK });
    }
    catch (err) {
        next(err);
    }
};
const industryList = async (req, res, next) => {
    try {
        const cond = {
            isDelete: false,
            isActive: true,
            catId: req.params.id
        };
        const list = await category_1.industryModel.find(cond);
        res.status(OK).json({ itemList: list, code: OK });
    }
    catch (err) {
        next(err);
    }
};
const knowledge_baseList = async (req, res, next) => {
    try {
        const { id, role } = req.user.id;
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
        const list = await index_2.knowledge_baseModel.find(cond, { fileUrl: 1, uploadBy: 1, userId: 1 }).sort({ createdAt: -1 });
        res.status(OK).json({ itemList: list, code: OK });
    }
    catch (err) {
        next(err);
    }
};
module.exports = {
    addPrompt,
    editPrompt,
    add_editContext_scope,
    add_editExecution_requirement,
    promptDetails,
    prompt_list,
    deletePrompt,
    catList,
    industryList,
    knowledge_baseList
};
