import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    userName:{
        type:String,
        required:false,
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    }


}, {
    timeStamp: true,
    createdOn: true,
    updatedOn: true,
}
)

const User = mongoose.model('User', userSchema);
export default User;