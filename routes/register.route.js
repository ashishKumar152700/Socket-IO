import express from "express";
import {deleteUser, getUsers, register} from "../controllers/register.contoller.js";
import { verifyJWT } from "../utils/verfiyJWT.js";

const router = express.Router();


router.post("/register", register);
// router.route("/allusers").get(getUsers);
router.route("/allusers").get(verifyJWT, getUsers);
router.route("/delete_user/:id").delete(verifyJWT, deleteUser);

export default router;
