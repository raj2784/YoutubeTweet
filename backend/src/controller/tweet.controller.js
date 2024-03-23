import mongoose, {isValidObjectId} from "mongoose";
import {User} from "../model/user.model.js";
import {asyncHandler} from "../utility/asyncHandler.js";
import {APIError} from "../utility/APIError.js";
import {APIResponse} from "../utility/APIResponse.js";
import {Tweet} from "../model/tweet.model.js";

const createTweet = asyncHandler(async (req, res) => {
  try {
    const {content} = req.body;

    const user = await User.findById(req.user?._id);
    console.log(user._id);

    if (!user) {
      throw new APIError(404, "User not found");
    }

    if (!content) {
      throw new APIError(404, "Tweets cannot be empty");
    }

    const tweet = await Tweet.create({content: content, owner: user._id});

    if (!tweet) {
      throw new APIError(500, "Something went wrong while creating tweets");
    }

    return res
      .status(200)
      .json(new APIResponse(200, tweet, "Tweet create successfully"));
  } catch (e) {
    throw new APIError(500, "Some error occured");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new APIError(404, "User not found");
    }

    const userTweet = await Tweet.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "owner",
          tweets: {$push: "$content"},
        },
      },
      {
        $project: {
          _id: 0,
          tweets: 1,
        },
      },
    ]);

    if (!userTweet || userTweet.length === 0) {
      throw new APIResponse(400, [], "User has no tweets yet");
    }

    return res
      .status(200)
      .json(new APIResponse(200, userTweet, "Tweets fetched successfully"));
  } catch (e) {
    throw new APIError(
      500,
      e?.message || "Some error occured while getting tweets",
    );
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  try {
    const {content} = req.body;
    const {tweetId} = req.params;
    const user = await User.findById(req.user?._id);
    const userId = user?._id;

    if (!content) {
      throw new APIError(400, "Tweet required to update");
    }

    const existingTweet = await Tweet.findById(tweetId);

    if (!existingTweet) {
      throw new APIError(400, "Tweet doesn't exist");
    }
    // console.log("test", existingTweet.owner);
    // console.log("test2", userId);
    // check weather user is owner or not
    if (existingTweet.owner.toString() !== userId.toString()) {
      throw new APIError(300, "Unauthorised Access,can't update the tweet");
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: {
          content: content,
        },
      },
      {
        new: true,
      },
    );

    if (!updatedTweet) {
      throw new APIError(400, "Tweet not found");
    }

    return res
      .status(200)
      .json(new APIResponse(200, updatedTweet, "Tweet updated successfully"));
  } catch (e) {
    throw new APIError(500, e.message || "Some error occured");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const {tweetId} = req.params;
    const user = await User.findById(req.user?._id);
    const userId = user._id;

    const existingTweet = await Tweet.findById(tweetId);
    if (!existingTweet) {
      throw new APIError(400, "Tweet doesn't exist");
    }

    // console.log("existingTweet.owner", existingTweet.owner);
    // console.log("userId", userId);
    if (existingTweet.owner.toString() !== userId.toString()) {
      throw new APIError(300, "Unautorised Access, can not delete the tweet");
    }

    const tweetDeleted = await Tweet.findByIdAndDelete(tweetId, {
      $unset: {
        content: 1,
      },
    });

    //const tweetDeleted = await Tweet.findOneAndDelete(tweetId);
    if (!tweetDeleted) {
      throw new APIError(404, "Tweet not found");
    }

    return res
      .status(200)
      .json(new APIResponse(200, {tweetDeleted}, "Tweet Deleted successfully"));
  } catch (error) {
    throw new APIError(400, error.message || "Something went wrong");
  }
});

export {createTweet, updateTweet, getUserTweets, deleteTweet};
