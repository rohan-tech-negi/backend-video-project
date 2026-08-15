import {asyncHandler}  from "../utils/asyncHandler.js"


const registerUser = asyncHandler(async(req,res)=>{
     const {userName, fullName, email,password} = req.body

    
})

export {registerUser}