import {Router} from "express";
import {
  publishVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  updateVideo,
  updateVideoDetails,
  deleteVideo,
  getVideoByUserId,
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
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishVideo,
  );

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(updateVideoDetails);

router
  .route("/updatevideo/:videoId")
  //.patch(upload.single("videoFile"), updateVideo);
  .patch(
    upload.fields([
      {name: "thumbnail", maxCount: 1},
      {name: "videoFile", maxCount: 1},
    ]),
    updateVideo,
  );

router.route("/user/:userId").get(getVideoByUserId);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
