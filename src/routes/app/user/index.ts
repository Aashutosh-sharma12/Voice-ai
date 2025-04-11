import { Router } from "express";
const baseRoute = Router();
import auth from "./auth";
import add from "./add";

baseRoute.use('/auth', auth);
baseRoute.use('/add', add);

export default baseRoute;