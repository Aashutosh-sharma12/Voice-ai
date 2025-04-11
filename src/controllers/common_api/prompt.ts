import messages from "@Custom_message/index";
import { industryModel } from "@models/category";
import { categoryModel, knowledge_baseModel, prompt_task_structureModel, prompt_taskModel, promptModel } from "@models/index";
import { CustomError } from "@utils/errors";
import { convertToJsonFromUrl } from "@utils/helpers";
import { Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
const { OK, CREATED } = StatusCodes;
const addPrompt = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step1_draftStatus } = req.body;
        let body_obj = {
            ...req.body,
            addBy: role,
            step1_status: step1_draftStatus === true ? false : true
        }
        if (role == 'user') {
            body_obj = {
                ...body_obj,
                userId: id
            }
        }
        const add = await promptModel.create(body_obj);
        res.status(CREATED).json({ data: add, code: CREATED });
    } catch (err) {
        next(err);
    }
}
const editPrompt = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step1_draftStatus, promptId } = req.body;
        let body_obj = {
            ...req.body,
            step1_status: step1_draftStatus === true ? false : true
        }
        let cond: any = {
            _id: promptId,
            addBy: role
        }
        if (role == 'user') {
            body_obj = {
                ...body_obj,
                userId: id
            }
            cond = {
                ...cond,
                userId: id
            }
        }
        const findAndUpdate = await promptModel.findOneAndUpdate(cond, body_obj, { new: true });
        res.status(CREATED).json({ data: findAndUpdate, code: CREATED });
    } catch (err) {
        next(err);
    }
}

const add_editContext_scope = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step2_draftStatus, promptId } = req.body;
        let cond_obj: any = {
            _id: promptId
        }
        if (role == 'user') {
            cond_obj = {
                ...cond_obj,
                userId: id
            }
        }
        let body = {
            ...req.body,
            step2_status: step2_draftStatus === true ? false : true
        }
        const promptDetails = await promptModel.findOneAndUpdate(cond_obj, body, { new: true });
        if (promptDetails) {
            res.status(CREATED).json({ data: promptDetails, code: CREATED });
        } else {
            throw new CustomError(messages.noDatafound, StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        next(err);
    }
}

const add_editExecution_requirement = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step3_draftStatus, promptId, task_details, prompt_task_structure_details } = req.body;
        let cond_obj: any = {
            _id: promptId
        }
        if (role == 'user') {
            cond_obj = {
                ...cond_obj,
                userId: id
            }
        }
        let body = {
            ...req.body,
            step3_status: step3_draftStatus === true ? false : true
        }
        const promptDetails = await promptModel.findOne(cond_obj, { addBy: 1 });
        if (promptDetails) {
            if (task_details.length) {
                task_details.forEach(async (item: any) => {
                    item.promptId = promptId
                    item.userId = id
                    if (item.isDelete === true) {
                        await prompt_taskModel.updateOne({ _id: item._id }, { isDelete: true });
                    }
                    if (item._id && item._id != '') {
                        await prompt_taskModel.updateOne({ _id: item._id }, item);
                    } else {
                        delete item._id;
                        await prompt_taskModel.create(item);
                    }
                });
            }
            if (prompt_task_structure_details.length) {
                prompt_task_structure_details.forEach(async (item: any) => {
                    item.promptId = promptId
                    item.userId = id
                    if (item.isDelete === true) {
                        await prompt_task_structureModel.updateOne({ _id: item._id }, { isDelete: true });
                    }
                    if (item._id && item._id != '') {
                        await prompt_task_structureModel.updateOne({ _id: item._id }, item);
                    } else {
                        delete item._id;
                        await prompt_task_structureModel.create(item);
                    }
                });
            }
            await promptModel.updateOne(cond_obj, body);
            res.status(CREATED).json({ data: { success: true }, code: CREATED });
        } else {
            throw new CustomError(messages.noDatafound, StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        next(err);
    }
}

const promptDetails = async (req: any, res: Response, next: NextFunction) => {
    try {
        const promptId = req.params.id;
        const promptDetails = await promptModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(promptId), isDelete: false
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
    } catch (err) {
        next(err);
    }
}

const prompt_list = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { page = 1, perPage = 10, search, filterId } = req.query;
        let cond: any = {
            isDelete: false, isActive: true
        }
        if (search) {
            cond = {
                ...cond,
                title: { $regex: search, $options: 'i' }
            }
        }
        if (filterId) {
            cond = {
                ...cond,
                $or: [
                    { categoryId: new mongoose.Types.ObjectId(filterId) },
                    { industriesId: new mongoose.Types.ObjectId(filterId) }
                ]
            }
        }
        const [list, count] = await Promise.all([
            promptModel.aggregate([
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
            promptModel.aggregate([
                {
                    $match: cond
                },
                {
                    $count: "totalCount"
                }
            ])
        ]);
        res.status(OK).json({ itemList: list, totalCount: count.length ? count[0].totalCount : 0, code: OK });
    } catch (err) {
        next(err);
    }
}

const deletePrompt = async (req: any, res: Response, next: NextFunction) => {
    try {
        const promptId = req.params.id;
        const findAndDelete = await promptModel.findOneAndUpdate({ _id: promptId }, { isDelete: true }, { new: true, fields: { isDelete: 1, addBy: 1 } });
        if (findAndDelete) {
            res.status(OK).json({ data: { success: true }, code: OK });
        } else {
            throw new CustomError(messages.noDatafound, StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        next(err);
    }
}

const catList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cond = {
            isDelete: false,
            isActive: true
        }
        const list = await categoryModel.aggregate([
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
    } catch (err) {
        next(err);
    }
}

const industryList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cond = {
            isDelete: false,
            isActive: true,
            catId: req.params.id
        }
        const list = await industryModel.find(cond);
        res.status(OK).json({ itemList: list, code: OK });
    } catch (err) {
        next(err);
    }
}

const knowledge_baseList = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user.id
        let cond: any = {
            isDelete: false,
            isActive: true
        }
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
            }
        }
        const list = await knowledge_baseModel.find(cond, { fileUrl: 1, uploadBy: 1, userId: 1 }).sort({ createdAt: -1 });
        res.status(OK).json({ itemList: list, code: OK });
    } catch (err) {
        next(err);
    }
}

export = {
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
}