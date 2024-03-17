import {Router} from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controller/subscription.controller.js";
import {verifyJWT} from "../middleware/useAuth.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/channel/:channelId")
  .get(getSubscribedChannels)
  .post(toggleSubscription);

router.route("/user/:subscriberId").get(getUserChannelSubscribers);

export default router;
