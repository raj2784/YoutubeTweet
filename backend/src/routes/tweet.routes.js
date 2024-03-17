import {Router} from "express";
import {
  createTweet,
  updateTweet,
  getUserTweets,
  deleteTweet,
} from "../controller/tweet.controller.js";
import {verifyJWT} from "../middleware/useAuth.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;
