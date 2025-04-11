import { Router } from "express";
import listController from '@controllers/common_api/list';
import { schemaValidator, schemaValidator_forQueryReq } from "@utils/schemaValidator";
import { checkRole, verifyAuthToken } from "@utils/authValidator";
import { promptListSchema } from "@validators/common/list";

const route = Router();
const p = {

    catList: '/catList',
    industryList: '/industryList',
    knowledge_baseList: '/knowledge_baseList',
    promptList: '/promptList',
    ai_providerList: '/ai_providerList',
    ai_modelList: '/ai_modelList/:id',
    transcription_providerList: '/transcription_providerList',
    transcription_modelList: '/transcription_modelList/:id',
    voice_providerList: '/voice_providerList',
    voice_modelList: '/voice_modelList/:id'
};

route.get(p.catList, verifyAuthToken, checkRole(['user', 'admin']), listController.catList);
route.get(p.industryList, verifyAuthToken, checkRole(['user', 'admin']), listController.industryList);
route.get(p.knowledge_baseList, verifyAuthToken, checkRole(['user', 'admin']), listController.knowledge_baseList);
route.get(p.promptList, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator_forQueryReq(promptListSchema), listController.promptList);
route.get(p.ai_providerList, verifyAuthToken, checkRole(['user', 'admin']), listController.ai_providerList);
route.get(p.ai_modelList, verifyAuthToken, checkRole(['user', 'admin']), listController.ai_modelList);
route.get(p.transcription_providerList, verifyAuthToken, checkRole(['user', 'admin']), listController.transcription_providerList);
route.get(p.transcription_modelList, verifyAuthToken, checkRole(['user', 'admin']), listController.transcription_modelList);
route.get(p.voice_providerList, verifyAuthToken, checkRole(['user', 'admin']), listController.voice_providerList);
route.get(p.voice_modelList, verifyAuthToken, checkRole(['user', 'admin']), listController.voice_modelList);

export default route;