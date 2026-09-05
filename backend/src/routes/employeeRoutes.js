import {Router} from "express";

import {fetchUserDetails} from "../controllers/employeeControllers.js";

const router = Router();

router.get("/get-details", fetchUserDetails);

export default router;