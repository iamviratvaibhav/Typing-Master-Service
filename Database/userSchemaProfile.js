import mongoose from "mongoose";

const userSchemaProfile = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    }, 
    lastName:{
        type:String,
        required:true,
    },
    profession:{
        type:String,
        minLength:3,
        maxLength:30,
        required:true,
    },
    about:{
        type:String,
        minLength:3,
        maxLength:300,
        required:true,
    },
    profileImage:{
        type:String,
        required:true,
        default:"https://res.cloudinary.com/your_cloud_name/image/upload/v1722123456/default_profile.png"
    }
    
})

const userSchemaProfileModel = mongoose.model.user || mongoose.model("user", userSchemaProfile)
export default userSchemaProfileModel; 