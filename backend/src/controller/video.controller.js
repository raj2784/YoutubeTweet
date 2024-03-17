import {uploadOnCloudinary} from "../utility/cloudinaryFile.js";
import {asyncHandler} from "../utility/asyncHandler.js";
import {Video} from "../model/video.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query;
});

const publishVideo = asyncHandler(async (req, res) => {
  const {title, description} = req.body;
});

const getVideoById = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
});

const updateVideo = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
});

const deleteVideo = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
});

export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
