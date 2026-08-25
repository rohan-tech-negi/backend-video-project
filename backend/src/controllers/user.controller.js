import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async(userId)=>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refereshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase()
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if(!createdUser){
   throw new ApiError(500, "Something went wrng while registring the user")
  }

  return res.status(201).json(
   new APiResponse(200, createdUser, "created user successfully")
  )



});


const loginUser  = asyncHandler(async(req,res)=>{
  const {email, username, password} = req.body;

  if(!username || !email){
    throw new ApiError(400, "username or email is required")
  }
  const user = User.findOne({
    $or: [{username}, {email}]
  })

  if(!user){
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordValid = await User.isPasswordCorrect(password)
   if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
  }

  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refershToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", options).json(
    new APiResponse(
      200,
      {
        user: loggedInUser, accessToken, refreshToken
      },
      "User loggedin successfully"
    )
  )




})

const logoutUser = asyncHandler(async(req,res)=>{
  
})
export { registerUser , loginUser};
