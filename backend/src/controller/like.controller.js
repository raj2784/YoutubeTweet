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
  try {
    const {tweetId} = req.params;
    if (!tweetId) {
      throw new APIError(404, "Tweet not found");
    }
    const userId = req.user?._id;
    console.log("userId", userId);
    const likeCriteria = {tweet: tweetId, likedBy: userId};
    const alreadyLiked = await Like.findOne(likeCriteria);
    if (!alreadyLiked) {
      const newLike = await Like.create(likeCriteria);
      if (!newLike) {
        throw new APIError(500, "Unable to like the tweet");
      }

      return res
        .status(200)
        .json(new APIResponse(200, newLike, "Successfully like the tweet"));
    }
    // if already liked
    const disLike = await Like.deleteOne(likeCriteria);
    if (!disLike) {
      throw new APIError(500, "Unable to dislike the tweet");
    }
    return res
      .status(200)
      .json(new APIResponse(200, {}, "Successfully dislike the tweet"));
  } catch (error) {
    throw new APIError(500, error?.message, "Something went wrong");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {});

export {toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos};
