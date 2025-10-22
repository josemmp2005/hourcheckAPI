import express from "express";
import { requestVacation, getLastsVacationUserRequest, getVacationUserRequests } from "../controllers/vacationController.js";

const router = express.Router();

router.post("/", requestVacation);
router.post("/lasts-three", getLastsVacationUserRequest);
router.post("/user/history", getVacationUserRequests);



export default router;