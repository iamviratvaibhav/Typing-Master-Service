
import userSchemaProfile from '../models/userModels.js';

const updateUserProfile = async (req, res) => {
    const { firtName, lastName, profession, about } = req.body
    const profileImage = req.file;

    try {
        if (!firtName || !lastName || !profession || !profileImage) {
            console.log("Please enter first name, last name, profession and profile image");
            return res.status(400).json({
                message: "Enter first name, last name, profession and profile image",
                success: false,
            })

        }
        else if(firtName !== '' && lastName !== '' && profession !== ' '){ 
            firtName.trim(), lastName.trim(), profession.trim()

        }
        await userSchemaProfile.findByIdAndUpdate(userId, {
            firtName,
            lastName,
            profession,
            about
        })

        if(profileImage){
            // upload image to cloudinary 
            const imageUpload= await cloudinary.uploader.upload(profileImage.path ,{
                resource_type:"image",
            })
            const imageURL = imageUpload.secure_url;
            await userSchemaProfile.findByIdAndUpdate(userId, {
                image:imageURL
            })
        }
        res.json({
            message: "Profile updated successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }

}
export default updateUserProfile;