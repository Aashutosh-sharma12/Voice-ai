import { Router } from "express";
import adminController from "@controllers/admin/auth";
import { StatusCodes } from "http-status-codes";
import { schemaValidator } from "@utils/schemaValidator";
import { adminLogin, adminSignup } from "@validators/admin/adminValidator";


const authRoute = Router();
const { OK, CREATED } = StatusCodes;

const p = {
  add: "/addAdmin",
  login: "/login",
};

authRoute.post(p.add, schemaValidator(adminSignup), async (req, res) => {
  const data = await adminController.adminSignup(req.body, req.headers);
  res.status(CREATED).json({ data, code: CREATED });
});


authRoute.post(p.login, schemaValidator(adminLogin), async (req, res) => {
  const data = await adminController.adminLogin(req.body, req.headers);
  res.status(OK).json({ code: OK, data });
});


export default authRoute;
