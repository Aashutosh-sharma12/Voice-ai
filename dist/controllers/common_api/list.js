"use strict";
const index_1 = require("../../models/index");
const http_status_codes_1 = require("http-status-codes");
const { OK, CREATED } = http_status_codes_1.StatusCodes;
const catList = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        let cond = {
            isDelete: false,
            isActive: true
        };
        if (role === 'user') {
            cond = {
                ...cond,
                $or: [
                    { addBy: 'admin' },
                    { userId: id }
                ]
            };
        }
        const list = await index_1.categoryModel.aggregate([
            {
                $match: cond
            },
            {
                $sort: { createdAt: -1 }
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
        const { id, role } = req.user;
        let cond = {
            isDelete: false,
            isActive: true
        };
        if (role === 'user') {
            cond = {
                ...cond,
                $or: [
                    { addBy: 'admin' },
                    { userId: id }
                ]
            };
        }
        const list = await index_1.industryModel.find(cond).sort({ createdAt: -1 });
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
                    { uploadBy: 'admin' }
                ]
            };
        }
        const list = await index_1.knowledge_baseModel.find(cond, { fileUrl: 1, uploadBy: 1, userId: 1 }).sort({ createdAt: -1 });
        res.status(OK).json({ itemList: list, code: OK });
    }
    catch (err) {
        next(err);
    }
};
const promptList = async (req, res, next) => {
    try {
        const { id, role } = req.user.id;
        const { catId, industriesId } = req.query;
        let cond = {
            isDelete: false,
            isActive: true,
            categoryId: catId,
            industriesId: industriesId
        };
        if (role == 'user') {
            cond = {
                ...cond,
                $or: [
                    { userId: id },
                    { uploadBy: 'admin' }
                ]
            };
        }
        const list = await index_1.promptModel.find(cond).sort({ createdAt: -1 });
        res.status(OK).json({ itemList: list, code: OK });
    }
    catch (err) {
        next(err);
    }
};
const ai_providerList = async (req, res, next) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true
        };
        const list = await index_1.ai_providerModel.aggregate([
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
    }
    catch (err) {
        next(err);
    }
};
const ai_modelList = async (req, res, next) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true,
            providerId: req.params.id
        };
        const list = await index_1.ai_providerModel_model.find(cond).sort({ createdAt: -1 });
        res.status(OK).json({ code: OK, itemList: list });
    }
    catch (err) {
        next(err);
    }
};
const transcription_providerList = async (req, res, next) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true
        };
        const list = await index_1.transcription_providerModel.aggregate([
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
    }
    catch (err) {
        next(err);
    }
};
const transcription_modelList = async (req, res, next) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true,
            providerId: req.params.id
        };
        const list = await index_1.transcription_providerModel_model.find(cond).sort({ createdAt: -1 });
        res.status(OK).json({ code: OK, itemList: list });
    }
    catch (err) {
        next(err);
    }
};
const voice_providerList = async (req, res, next) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true
        };
        const list = await index_1.voice_providerModel.aggregate([
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
    }
    catch (err) {
        next(err);
    }
};
const voice_modelList = async (req, res, next) => {
    try {
        let cond = {
            isDelete: false,
            isActive: true,
            providerId: req.params.id
        };
        const [modelList, voiceList] = await Promise.all([
            index_1.voice_providerModel_model.find(cond).sort({ createdAt: -1 }),
            index_1.voice_providerVoice_model.find(cond).sort({ createdAt: -1 })
        ]);
        res.status(OK).json({ code: OK, modelList: modelList, voiceList: voiceList });
    }
    catch (err) {
        next(err);
    }
};
module.exports = {
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
};
