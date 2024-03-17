import {Router} from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../controller/dashboard.controller.js";
import {verifyJWT} from "../middleware/useAuth.js";

const router = Router();

router.use(verifyJWT);

router.route("/channelstats").get(getChannelStats);

router.route("/channelvideos").get(getChannelVideos);
