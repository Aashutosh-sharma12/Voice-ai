import { ai_providerModel, ai_providerModel_model, categoryModel, industryModel, knowledge_baseModel, promptModel, transcription_providerModel, transcription_providerModel_model, voice_providerModel, voice_providerModel_model, voice_providerVoice_model } from "@models/index";
import { NextFunction, Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
const { OK, CREATED } = StatusCodes;

const catList = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        let cond: any = {
            isDelete: false,
            isActive: true
        }
        if (role === 'user') {
            cond = {
                ...cond,
                $or: [
                    { addBy: 'admin' },
                    { userId: id }
                ]

            }
        }
        const list = await categoryModel.aggregate([
            {
                $match: cond
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        res.status(OK).json({ itemList: list, code: OK });
    } catch (err) {
        next(err);
    }
}

const industryList = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        let cond: any = {
            isDelete: false,
            isActive: true
        }
        if (role === 'user') {
            cond = {
                ...cond,
                $or: [
                    { addBy: 'admin' },
                    { userId: id }
                ]

            }
        }
        const list = await industryModel.find(cond).sort({ createdAt: -1 });
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
                    { uploadBy: 'admin' }
                ]
            }
        }
        const list = await knowledge_baseModel.find(cond, { fileUrl: 1, uploadBy: 1, userId: 1 }).sort({ createdAt: -1 });
        res.status(OK).json({ itemList: list, code: OK });
    } catch (err) {
        next(err);
    }
}

const promptList = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user.id
        const { catId, industriesId } = req.query;
        let cond: any = {
            isDelete: false,
            isActive: true,
            categoryId: catId,
            industriesId: industriesId
        }
        if (role == 'user') {
            cond = {
                ...cond,
                $or: [
                    { userId: id },
                    { uploadBy: 'admin' }
                ]
            }
        }
        const list = await promptModel.find(cond,).sort({ createdAt: -1 });
        res.status(OK).json({ itemList: list, code: OK });
    } catch (err) {
        next(err);
    }
}

const ai_providerList = async (req: any, res: Response, next: NextFunction) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true
        }
        const list = await ai_providerModel.aggregate([
            {
                $match: cond
            },
            {
                $lookup: {
                    foreignField: "providerId",
                    localField: "_id",
                    as: "modelList",
                    from: "ai_providerModels",
                    pipeline: [
                        {
                            $match: cond
                        }
                    ]
                }
            },
            {
                $match: {
                    modelList: { $ne: [] }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        res.status(OK).json({ code: OK, itemList: list });
    } catch (err) {
        next(err);
    }
}

const ai_modelList = async (req: any, res: Response, next: NextFunction) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true,
            providerId: req.params.id
        }
        const list = await ai_providerModel_model.find(cond).sort({ createdAt: -1 });
        res.status(OK).json({ code: OK, itemList: list });
    } catch (err) {
        next(err);
    }
}

const transcription_providerList = async (req: any, res: Response, next: NextFunction) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true
        }
        const list = await transcription_providerModel.aggregate([
            {
                $match: cond
            },
            {
                $lookup: {
                    foreignField: "providerId",
                    localField: "_id",
                    as: "modelList",
                    from: "transcription_providerModels",
                    pipeline: [
                        {
                            $match: cond
                        }
                    ]
                }
            },
            {
                $match: {
                    modelList: { $ne: [] }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        res.status(OK).json({ code: OK, itemList: list });
    } catch (err) {
        next(err);
    }
}

const transcription_modelList = async (req: any, res: Response, next: NextFunction) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true,
            providerId: req.params.id
        }
        const list = await transcription_providerModel_model.find(cond).sort({ createdAt: -1 });
        res.status(OK).json({ code: OK, itemList: list });
    } catch (err) {
        next(err);
    }
}

const voice_providerList = async (req: any, res: Response, next: NextFunction) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true
        }
        const list = await voice_providerModel.aggregate([
            {
                $match: cond
            },
            {
                $lookup: {
                    foreignField: "providerId",
                    localField: "_id",
                    as: "modelList",
                    from: "voice_providerModels",
                    pipeline: [
                        {
                            $match: cond
                        }
                    ]
                }
            },
            {
                $lookup: {
                    foreignField: "providerId",
                    localField: "_id",
                    as: "voiceList",
                    from: "voice_providerVoices",
                    pipeline: [
                        {
                            $match: cond
                        }
                    ]
                }
            },
            {
                $match: {
                    modelList: { $ne: [] }, voiceList: { $ne: [] }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        res.status(OK).json({ code: OK, itemList: list });
    } catch (err) {
        next(err);
    }
}

const voice_modelList = async (req: any, res: Response, next: NextFunction) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true,
            providerId: req.params.id
        }
        const [modelList, voiceList] = await Promise.all([
            voice_providerModel_model.find(cond).sort({ createdAt: -1 }),
            voice_providerVoice_model.find(cond).sort({ createdAt: -1 })
        ]);
        res.status(OK).json({ code: OK, modelList: modelList, voiceList: voiceList });
    } catch (err) {
        next(err);
    }
}

export = {
    catList,
    industryList,
    knowledge_baseList,
    promptList,
    ai_providerList,
    ai_modelList,
    transcription_providerList,
    transcription_modelList,
    voice_providerList,
    voice_modelList
} as const;