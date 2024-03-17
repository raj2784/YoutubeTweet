import mongoose, {isValidObjectId} from "mongoose";
import {APIResponse} from "../utility/APIResponse.js";
import {APIError} from "../utility/APIError.js";
import {asyncHandler} from "../utility/asyncHandler.js";
import {Like} from "../model/likes.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const {videoId} = req.params;
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const {tweetId} = req.params;
});

const getLikedVideos = asyncHandler(async (req, res) => {});

export {toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos};
