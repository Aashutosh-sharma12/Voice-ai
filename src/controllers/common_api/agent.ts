import messages from "@Custom_message/index";
import { agentModel } from "@models/index";
import { CustomError } from "@utils/errors";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
const { OK, CREATED } = StatusCodes;
const addBasicInfo = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step1_draftStatus } = req.body;
        let body_obj = {
            ...req.body,
            addBy: role,
            step1_status: step1_draftStatus === true ? false : true
        }
        if (role === 'user') {
            body_obj = {
                ...body_obj,
                userId: id
            }
        }
        const add = await agentModel.create(body_obj);
        res.status(CREATED).json({ data: add, code: CREATED });
    } catch (err) {
        next(err);
    }
}

const editBasicInfo = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step1_draftStatus, agentId } = req.body;
        let body_obj = {
            ...req.body,
            step1_status: step1_draftStatus === true ? false : true
        }
        let cond: any = {
            _id: agentId,
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
        const findAndUpdate = await agentModel.findOneAndUpdate(cond, body_obj, { new: true, fields: { userId: 1, addBy: 1, title: 1, categoryId: 1, industriesId: 1, step1_status: 1, step1_draftStatus: 1, ai_providerId: 1, ai_modelId: 1, ai_token: 1, promptId: 1, temperature: 1, detectEmotion: 1, step2_status: 1, step2_draftStatus: 1 } });
        res.status(CREATED).json({ data: findAndUpdate, code: CREATED });
    } catch (err) {
        next(err);
    }
}

const add_editAI_configuration = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step2_draftStatus, agentId } = req.body;
        let body_obj = {
            ...req.body,
            step2_status: step2_draftStatus === true ? false : true
        }
        let cond: any = {
            _id: agentId,
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
        const findAndUpdate = await agentModel.findOneAndUpdate(cond, body_obj, {
            new: true, fields: {
                userId: 1, addBy: 1, ai_providerId: 1, ai_modelId: 1, ai_token: 1, promptId: 1, temperature: 1, detectEmotion: 1, step2_status: 1, step2_draftStatus: 1, transcription_providerId: 1,
                transcription_modelId: 1,
                transcription_language: 1,
                step3_status: 1,
                step3_draftStatus: 1
            }
        });
        res.status(CREATED).json({ data: findAndUpdate, code: CREATED });
    } catch (err) {
        next(err);
    }
}

const add_editTranscription_configuration = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step3_draftStatus, agentId } = req.body;
        let body_obj = {
            ...req.body,
            step3_status: step3_draftStatus === true ? false : true
        }
        let cond: any = {
            _id: agentId,
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
        const findAndUpdate = await agentModel.findOneAndUpdate(cond, body_obj, {
            new: true,
            fields: {
                userId: 1, addBy: 1, transcription_providerId: 1,
                transcription_modelId: 1,
                transcription_language: 1,
                step3_status: 1,
                step3_draftStatus: 1,
                voice_providerId: 1,
                voiceId: 1,
                voice_modelId: 1,
                voice_additionalConfiguration: 1,
                step4_status: 1,
                step4_draftStatus: 1
            }
        });
        res.status(CREATED).json({ data: findAndUpdate, code: CREATED });
    } catch (err) {
        next(err);
    }
}

const add_editVoice_configuration = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step4_draftStatus, agentId, background_sound, min_characters, punctuation_boundaries, stability, clarity_similarity, style_exaggeration, streaming_latency } = req.body;
        let body_obj = {
            ...req.body,
            voice_additionalConfiguration: {
                background_sound: background_sound,
                min_characters: min_characters,
                punctuation_boundaries: punctuation_boundaries,
                stability: stability,
                clarity_similarity: clarity_similarity,
                style_exaggeration: style_exaggeration,
                streaming_latency: streaming_latency
            },
            step4_status: step4_draftStatus === true ? false : true
        }
        let cond: any = {
            _id: agentId,
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
        const findAndUpdate = await agentModel.findOneAndUpdate(cond, body_obj, {
            new: true,
            fields: {
                userId: 1, addBy: 1,
                voice_providerId: 1,
                voiceId: 1,
                voice_modelId: 1,
                voice_additionalConfiguration: 1,
                step4_status: 1,
                step4_draftStatus: 1,
                isEnabled_endCallFunction: 1,
                dial_keypad: 1,
                countryCode: 1,
                phoneNumber: 1,
                end_callPhrase: 1,
                step5_status: 1,
                step5_draftStatus: 1
            }
        });
        res.status(CREATED).json({ data: findAndUpdate, code: CREATED });
    } catch (err) {
        next(err);
    }
}

const add_editFunction_configuration = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step5_draftStatus, agentId } = req.body;
        let body_obj = {
            ...req.body,
            step5_status: step5_draftStatus === true ? false : true
        }
        let cond: any = {
            _id: agentId,
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
        const findAndUpdate = await agentModel.findOneAndUpdate(cond, body_obj, {
            new: true,
            fields: {
                userId: 1, addBy: 1,
                isEnabled_endCallFunction: 1,
                dial_keypad: 1,
                countryCode: 1,
                phoneNumber: 1,
                end_callPhrase: 1,
                step5_status: 1,
                step5_draftStatus: 1,
                isHIPAA_Compliance: 1,    // When this is enabled, no logs, recordings, or transcriptions will be stored.
                isAudio_Recording: 1,     // Record the conversation with the assistant.
                isVideo_Recording: 1,     // Enable or disable video recording during a web call. This will record the video of your user.
                wait_seconds: 1,
                punctuation_seconds: 1,
                no_punctuation_seconds: 1,
                smart_endPoint: 1,
                step6_status: 1,
                step6_draftStatus: 1
            }
        });
        res.status(CREATED).json({ data: findAndUpdate, code: CREATED });
    } catch (err) {
        next(err);
    }
}

const add_editAdvance_configuration = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.user;
        const { step6_draftStatus, agentId } = req.body;
        let body_obj = {
            ...req.body,
            step6_status: step6_draftStatus === true ? false : true
        }
        let cond: any = {
            _id: agentId,
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
        const findAndUpdate = await agentModel.findOneAndUpdate(cond, body_obj, {
            new: true,
            fields: {
                userId: 1, addBy: 1,
                isHIPAA_Compliance: 1,    // When this is enabled, no logs, recordings, or transcriptions will be stored.
                isAudio_Recording: 1,     // Record the conversation with the assistant.
                isVideo_Recording: 1,     // Enable or disable video recording during a web call. This will record the video of your user.
                wait_seconds: 1,
                punctuation_seconds: 1,
                no_punctuation_seconds: 1,
                smart_endPoint: 1,
                step6_status: 1,
                step6_draftStatus: 1
            }
        });
        res.status(CREATED).json({ data: findAndUpdate, code: CREATED });
    } catch (err) {
        next(err);
    }
}

const agentDetails = async (req: any, res: Response, next: NextFunction) => {
    try {
        const agentId = req.params.id;
        const { id, role } = req.user;
        let cond: any = {
            isDelete: false,
            _id: new mongoose.Types.ObjectId(agentId)
        }
        if (role === 'user') {
            cond = {
                ...cond,
                userId: id
            }
        }
        const details = await agentModel.aggregate([
            {
                $match: cond
            }
        ]);
        res.status(OK).json({ code: OK, data: details.length ? details[0] : {} });
    } catch (err) {
        next(err);
    }
}

const agentList = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { page = 1, perPage = 10, search, filterId } = req.query;
        let cond: any = {
            isDelete: false
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
            agentModel.aggregate([
                {
                    $match: cond
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
            agentModel.aggregate([
                {
                    $match: cond
                },
                {
                    $count: "totalCount"
                }
            ])
        ]);
        res.status(OK).json({ code: OK, agentList: list, totalCount: count.length ? count[0].totalCount : 0 });
    } catch (err) {
        next(err);
    }
}

const deleteAgent = async (req: any, res: Response, next: NextFunction) => {
    try {
        const agentId = req.params.id;
        const { id, role } = req.user;
        let cond: any = {
            isDelete: false,
            _id: new mongoose.Types.ObjectId(agentId)
        }
        if (role === 'user') {
            cond = {
                ...cond,
                userId: id
            }
        }
        const findAndDelete = await agentModel.findOneAndUpdate(cond, { isDelete: true }, { new: true, fields: { addBy: 1 } });
        if (findAndDelete) {
            res.status(OK).json({ code: OK, data: { success: true } });
        } else {
            throw new CustomError(messages.noDatafound, StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        next(err);
    }
}

export = {
    addBasicInfo,
    editBasicInfo,
    add_editAI_configuration,
    add_editTranscription_configuration,
    add_editVoice_configuration,
    add_editFunction_configuration,
    add_editAdvance_configuration,
    agentDetails,
    agentList,
    deleteAgent
} as const;