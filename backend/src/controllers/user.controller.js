import { ApiError } from "../utils/ApiError.js"
import {asyncHandler}  from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"


const registerUser = asyncHandler(async(req,res)=>{
     const {userName, fullName, email,password} = req.body

     if(
        [fullName, userName, email, password].some((field)=>
            field?.trim() === ""
        )
     ){
        throw new ApiError(400, "All fields are required")
     }
     const existingUser = User.findOne({
      $or :[{userName}, {email}]
     })
     if(existingUser){
       throw new ApiError(409, "User with email or username already exists")
     }

     const avatarLocalPath = req.files?.avatar[0]?.path;

    
})

export {registerUser}