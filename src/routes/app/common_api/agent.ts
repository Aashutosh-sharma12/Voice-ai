import { Router } from "express";
import agentController from '@controllers/common_api/agent';
import { schemaValidator } from "@utils/schemaValidator";
import { checkRole, verifyAuthToken } from "@utils/authValidator";
import { addBasicInfoSchema, advance_configurationSchema, ai_configurationSchema, editBasicInfoSchema, function_configurationSchema, transcription_configurationSchema, voice_configurationSchema } from "@validators/common/agent";

const route = Router();
const p = {
    addBasicInfo: '/addBasicInfo',
    editBasicInfo: '/editBasicInfo',
    add_editAI_configuration: '/add_editAI_configuration',
    add_editTranscription_configuration: '/add_editTranscription_configuration',
    add_editVoice_configuration: '/add_editVoice_configuration',
    add_editFunction_configuration: '/add_editFunction_configuration',
    add_editAdvance_configuration: '/add_editAdvance_configuration',
    agentDetails: '/agentDetails/:id',
    agentList: '/agentList',
    deleteAgent: '/deleteAgent/:id'
};

route.post(p.addBasicInfo, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(addBasicInfoSchema), agentController.addBasicInfo);
route.put(p.editBasicInfo, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(editBasicInfoSchema), agentController.editBasicInfo);
route.put(p.add_editAI_configuration, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(ai_configurationSchema), agentController.add_editAI_configuration);
route.put(p.add_editTranscription_configuration, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(transcription_configurationSchema), agentController.add_editTranscription_configuration);
route.put(p.add_editVoice_configuration, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(voice_configurationSchema), agentController.add_editVoice_configuration);
route.put(p.add_editFunction_configuration, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(function_configurationSchema), agentController.add_editFunction_configuration);
route.put(p.add_editAdvance_configuration, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(advance_configurationSchema), agentController.add_editAdvance_configuration);
route.get(p.agentDetails, verifyAuthToken, checkRole(['user', 'admin']), agentController.agentDetails);
route.get(p.agentList, verifyAuthToken, checkRole(['user', 'admin']), agentController.agentList);
route.delete(p.deleteAgent, verifyAuthToken, checkRole(['user', 'admin']), agentController.deleteAgent);

export default route;