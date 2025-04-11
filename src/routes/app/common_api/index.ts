import { Router } from "express";
const baseRoute = Router();
import knowledge_base from "./knowledge_base";
import prompt from './prompt';
import list from './list';
import agent from './agent';

baseRoute.use('/knowledge_base', knowledge_base);
baseRoute.use('/prompt', prompt);
baseRoute.use('/list', list);
baseRoute.use('/agent', agent);

export default baseRoute;