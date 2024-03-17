import {Router} from "express";
import {verifyJWT} from "../middleware/useAuth.js";
import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComment,
} from "../controller/comment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/:videoId").get(getVideoComment).post(addComment);

router.route("/channel/commentId").delete(deleteComment).patch(updateComment);

export default router;
