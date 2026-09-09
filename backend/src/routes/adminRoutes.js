import {Router} from "express";

import { getAllUsers, createUser, createEmployee } from "../controllers/adminControllers.js";

const router = Router();

router.get("/", getAllUsers);
router.post("/create-user", createUser);
router.post("/create-employee", createEmployee);
export default router;