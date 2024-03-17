import {Router} from "express";
import {healthCheck} from "../controller/healthcheck.controller";

const router = Router();

router.route("/").get(healthCheck);

export default router;
