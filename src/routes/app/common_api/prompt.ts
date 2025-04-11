import { Router } from "express";
import promptController from '@controllers/common_api/prompt';
import { schemaValidator } from "@utils/schemaValidator";
import { checkRole, verifyAuthToken } from "@utils/authValidator";
import { add_editContext_scopeSchema, add_editExecution_requirementSchema, addPromptSchema, editPromptSchema } from "@validators/common/prompt";

const route = Router();
const p = {
    addPrompt: '/addPrompt',
    editPrompt: '/editPrompt',
    add_editContext_scope: '/add_editContext_scope',
    add_editExecution_requirement: '/add_editExecution_requirement',
    details: '/details/:id',
    list: '/list',
    deletePrompt: '/deletePrompt/:id',
    catList: '/catList',
    industryList: '/industryList/:id',
    knowledge_baseList: '/knowledge_baseList'
};

route.post(p.addPrompt, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(addPromptSchema), promptController.addPrompt);
route.put(p.editPrompt, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(editPromptSchema), promptController.editPrompt);
route.put(p.add_editContext_scope, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(add_editContext_scopeSchema), promptController.add_editContext_scope);
route.put(p.add_editExecution_requirement, verifyAuthToken, checkRole(['user', 'admin']), schemaValidator(add_editExecution_requirementSchema), promptController.add_editExecution_requirement);
route.get(p.details, verifyAuthToken, checkRole(['user', 'admin']), promptController.promptDetails);
route.get(p.list, verifyAuthToken, checkRole(['user', 'admin']), promptController.prompt_list);
route.delete(p.deletePrompt, verifyAuthToken, checkRole(['user', 'admin']), promptController.deletePrompt);
route.get(p.catList, verifyAuthToken, checkRole(['user', 'admin']), promptController.catList);
route.get(p.industryList, verifyAuthToken, checkRole(['user', 'admin']), promptController.industryList);
route.get(p.knowledge_baseList, verifyAuthToken, checkRole(['user', 'admin']), promptController.knowledge_baseList);

export default route;