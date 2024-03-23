import {uploadOnCloudinary} from "../utility/cloudinaryFile.js";
import {asyncHandler} from "../utility/asyncHandler.js";
import {Video} from "../model/video.model.js";
import mongoose, {isValidObjectId} from "mongoose";
import {User} from "../model/user.model.js";
import {APIError} from "../utility/APIError.js";
import {APIResponse} from "../utility/APIResponse.js";

const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query;
    // Define the query object based on the parameters
    const videoQuery = {};

    // If a search query is provided, match against title and description
    if (query) {
      videoQuery.$or = [
        {title: {$regex: query, $options: "i"}}, // Case-insensitive search
        {description: {$regex: query, $options: "i"}},
      ];
    }

    // If a userId is provided, filter videos by owner
    if (userId) {
      videoQuery.owner = userId;
    }

    const sortOptions = {};
    if (sortBy && sortType) {
      sortOptions[sortBy] = sortType === "asc" ? 1 : -1;
    }

    // const sortStage = {};
    // if (sortBy && sortType) {
    //   sortStage["$sort"] = {
    //     [sortBy]: sortType === "asc" ? 1 : -1,
    //   };
    // } else {
    //   sortStage["$sort"] = {
    //     createdAt: -1,
    //   };
    // }

    const videos = await Video.aggregatePaginate(videoQuery, {
      page: parseInt(page),
      limit: parseInt(limit),
      // sort: sortOptions,
    });
    return res
      .status(201)
      .json(new APIResponse(200, videos, "Videos retrieved successfully.."));
  } catch (e) {
    throw new APIError(500, e.message || "Some error occured");
  }
});

const publishVideo = asyncHandler(async (req, res) => {
  const {title, description, isPublished = true} = req.body;
  if (
    [title, description].some(
      (field) => field?.trim() === "" || field.trim() === undefined,
    )
  ) {
    throw new APIError(400, `${field} is required`);
  }
  let videoLocalPath;
  let thumbnailLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.videoFile) &&
    req.files.videoFile.length > 0
  ) {
    videoLocalPath = req.files.videoFile[0].path;
  }

  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  if (!videoLocalPath) {
    throw new APIError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new APIError(400, "Thumnail is required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken",
  );

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title: title,
    description: description,
    duration: videoFile.duration,
    isPublished: isPublished,
    owner: user._id,
  });
  return res
    .status(200)
    .json(new APIResponse(200, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  try {
    const {videoId} = req.params;

    if (!videoId) {
      throw new APIError(404, "Video not found");
    }

    if (!isValidObjectId(videoId)) {
      throw new APIError(404, "Video not found");
    }

    const video = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
        },
      },
    ]);

    return res
      .status(200)
      .json(new APIResponse(200, video, "Video fetch successfully"));
  } catch (e) {
    throw new APIError(500, e.message || "Some error occured");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  try {
    const {videoId} = req.params;

    // const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    // const videoLocalPath = req.files?.videoFile[0]?.path;

    let thumbnailLocalPath;
    let videoLocalPath;

    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.thumbnail.length > 0
    ) {
      thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    if (
      req.files &&
      Array.isArray(req.files.videoFile) &&
      req.files.videoFile.length > 0
    ) {
      videoLocalPath = req.files.videoFile[0].path;
    }

    console.log(thumbnailLocalPath);

    if (!thumbnailLocalPath) {
      throw new APIError(400, "Thumbnail is missing");
    }

    const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!newThumbnail.url) {
      throw new APIError(400, "Error while uploading thumbnail");
    }
    console.log(videoLocalPath);

    if (!videoLocalPath) {
      throw new APIError(400, "Video file is missing");
    }

    const newVideo = await uploadOnCloudinary(videoLocalPath);
    if (!newVideo.url) {
      throw new APIError(400, "Error while uploading video");
    }

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          thumbnail: newThumbnail.url || "",
          videoFile: newVideo.url || "",
        },
      },
      {new: true},
    );

    return res
      .status(200)
      .json(new APIResponse(201, video, "Video details updated successfully"));
  } catch (e) {
    throw new APIError(500, e.message || "Something went wrong");
  }
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  try {
    const {videoId} = req.params;
    const {title, description} = req.body;

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title,
          description,
        },
      },
      {new: true},
    );

    return res
      .status(200)
      .json(new APIResponse(200, video, "Video details updated successfully"));
  } catch (e) {
    throw new APIError(500, e.message || "Something went wrong");
  }
});

const getVideoByUserId = asyncHandler(async (req, res) => {
  try {
    const {userId} = req.params;
    if (!isValidObjectId(userId)) {
      throw new APIError(404, "This user is not found");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw APIError(400, "User not found");
    }

    const userVideos = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
    ]);
    console.log(userVideos);
    if (!userVideos || userVideos < 0) {
      throw new APIResponse(404, [], "This user have not uploaded any videos");
    }
    return res
      .status(200)
      .json(
        new APIResponse(
          200,
          userVideos,
          "All videos for the user feteched sucessfully",
        ),
      );
  } catch (e) {
    throw new APIError(500, e.message || "Something went wrong");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const {videoId} = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
      throw APIError(404, "This video is not found");
    }
    //check if the user is authorised to delete the video
    const video = await Video.findById(videoId);

    console.log(video.owner?._id);
    console.log("Video Owner", video.owner);
    console.log("logged In User", userId);

    if (video.owner.toString() !== userId.toString()) {
      throw new APIError(303, "You are unauthorised");
    }
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      throw APIError(400, "Can't delete video");
    }
    return res
      .status(200)
      .json(new APIResponse(200, deletedVideo, "Video deleted successfully"));
  } catch (e) {
    throw new APIError(500, e.message || "Something went wrong");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const {videoId} = req.params;
    if (!videoId || !isValidObjectId(videoId)) {
      throw new APIError(404, "Video not found");
    }
    const video = await Video.findById(videoId);

    if (!video) {
      throw new APIError(404, "Video not found");
    }
    video.isPublished = !video.isPublished;

    await video.save();

    return res
      .status(200)
      .json(
        new APIResponse(
          200,
          `publish status updated scuessfully. new status ${video.isPublished ? "Pulbished" : "UnPublished"}`,
          video,
        ),
      );
  } catch (error) {
    throw new APIError(500, "somehitng went wrong");
  }
});

export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
  getVideoByUserId,
};
