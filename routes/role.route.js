import express from "express";
import { verifyJWT } from "../utils/verfiyJWT.js";
import { addRole } from "../controllers/roles.controller.js";

const router=express.Router();


router.route("/add_roles").post(addRole);


export default router