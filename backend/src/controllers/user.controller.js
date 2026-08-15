import { ApiError } from "../utils/ApiError.js"
import {asyncHandler}  from "../utils/asyncHandler.js"


const registerUser = asyncHandler(async(req,res)=>{
     const {userName, fullName, email,password} = req.body

     if(
        [fullName, userName, email, password].some((field)=>
            field?.trim() === ""
        )
     ){
        throw new ApiError(400, "All fields are required")
     }

     

    
})

export {registerUser}