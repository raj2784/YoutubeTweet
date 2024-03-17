import {APIError} from "../utility/APIError.js";
import {asyncHandler} from "../utility/asyncHandler.js";
import {User} from "../model/user.model.js";
import {uploadOnCloudinary} from "../utility/cloudinaryFile.js";
import {APIResponse} from "../utility/APIResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});
    return {accessToken, refreshToken};
  } catch (error) {
    throw new APIError(
      500,
      "Something went wrong, while generating refresh and access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - of the form
  // check if user already exist in out db : check with user name or eamil
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // craete user object - create entry in db
  // remove passowrd and refresh token field from response
  // check for user creation
  // return res

  const {fullName, userName, userEmail, password} = req.body;
  //console.log("email :", userEmail);
  //   if (fullName === "") {
  //     throw new APIError(400, "Full Name is required");
  //   }
  if (
    [fullName, userEmail, userName, password].some(
      (field) => field?.trim() === "",
    )
  ) {
    throw new APIError(400, "All fields are required");
  }

  // to check the in the db weather user with email or username is already existed, we are using $or operator
  const existedUser = await User.findOne({
    $or: [{userName}, {userEmail}],
  });

  if (existedUser) {
    throw new APIError(409, "User with email or username is already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  //checking with classic JS: weather user have supplied cover image or not before uploding on cloudinary
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new APIError(
      400,
      "Avatar file is required, avatar localpath not found",
    );
  }

  //console.log(avatarLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //console.log(avatar.url);
  //console.log(coverImage.url);

  if (!avatar) {
    throw new APIError(400, "Avatar file is required");
  }

  // db entry with User Model
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // optionally upload url into db
    userEmail,
    password,
    userName: userName.toLowerCase(),
  });

  // _id created by default in Mongo DB
  // for removing field from the response .select("-password -refreshToken");
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new APIError(
      500,
      "Something went wrong while registering the user, please try after some time",
    );
  }
  return res
    .status(201)
    .json(new APIResponse(200, createdUser, "User registered Succsessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user in db
  // password check
  // access and refresh token
  // send cookies

  const {userEmail, userName, password} = req.body;
  if (!(userEmail || userName)) {
    throw new APIError(400, "username or password is required");
  }
  const user = await User.findOne({$or: [{userName}, {userEmail}]}); //$or mongoose operator

  if (!user) {
    throw new APIError(400, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new APIError(401, "Invalid password try again!");
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password,-refreshToken",
  );

  const options = {httpOnly: true, secure: true};

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new APIResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // $usnset mongo db operator : to revmove the field data from from db (mongo-db)
      },
    },
    {
      new: true,
    },
  );
  const options = {httpOnly: true, secure: true};

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APIResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToekn =
    req.cookie.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToekn) {
    throw new APIError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToekn,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new APIError(401, "Invalid refresh token");
    }
    if (incommingRefreshToekn !== user?.refreshToken) {
      throw new APIError(401, "Refresh token in expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(
      user._id,
    );

    return res
      .status(200)
      .cookie("accessToekn", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new APIResponse(
          200,
          {accessToken, refreshToken: newRefreshToken},
          "Access token updated",
        ),
      );
  } catch (error) {
    throw new APIError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword, confirmPassword} = req.body;

  if (!(newPassword === confirmPassword)) {
    throw new APIError(400, "Password is not match");
  }
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new APIError(400, "Invalid previous password");
  }

  user.password = newPassword;
  await user.save({validateBeforeSave: false});

  return res
    .status(200)
    .json(new APIResponse(200, "Password updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new APIResponse(200, req.user, "Current user fetched succssfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const {fullName, userEmail} = req.body;
  if (!fullName || !userEmail) {
    throw new APIError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        userEmail,
      },
    },
    {new: true},
  ).select("-password");

  return res
    .status(200)
    .json(new APIResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new APIError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new APIError(400, "Error while uploading avatart");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {new: true},
  ).select("-password");

  return res
    .status(200)
    .json(new APIResponse(200, user, "avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new APIError(400, "Cover Image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new APIError(400, "Error while uploading cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {new: true},
  ).select("-password");

  return res
    .status(200)
    .json(new APIResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const {userName} = req.params;

  if (!userName?.trim()) {
    throw new APIError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        userName: userName?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribersTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: {$in: [req.user?._id, "$subscribers.subscriber"]},
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        userEmail: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new APIError(404, "Channel does not exists");
  }
  return res
    .status(200)
    .json(
      new APIResponse(200, channel[0], "User channel fetched successfully"),
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "viddeos",
        localField: "watchHisotory",
        foreignField: _id,
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        user[0].watchHistory,
        "watch history fetched successfully",
      ),
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
