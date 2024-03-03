import {APIError} from "../utility/APIError.js";
import {asyncHandler} from "../utility/asyncHandler.js";
import {User} from "../model/user.model.js";
import {uploadOnCloudinary} from "../utility/cloudinaryFile.js";
import {APIResponse} from "../utility/APIResponse.js";

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

export {registerUser};
