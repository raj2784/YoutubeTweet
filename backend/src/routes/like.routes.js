import {Router} from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controller/like.controller.js";
import {verifyJWT} from "../middleware/useAuth.js";

const router = Router();

router.use(verifyJWT);

router.route("/togglevideolike/:videoId").post(toggleVideoLike);
router.route("/togglecommentlike/:commentId").post(toggleCommentLike);
router.route("/toggletweetlike/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;
