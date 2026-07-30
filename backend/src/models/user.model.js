import mongoose, {Schema} from "mongoose";

const userModel = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
     username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        
    },
    
})


export const User = mongoose.model("User", userModel)