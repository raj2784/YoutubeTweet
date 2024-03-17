import {Router} from "express";
import {
  publishVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  updateVideo,
  deleteVideo,
} from "../controller/video.controller.js";
import {verifyJWT} from "../middleware/useAuth.js";
import {upload} from "../middleware/useMulter.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: videoFile,
        maxCount: 1,
      },
    ]),
    publishVideo,
  );

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
