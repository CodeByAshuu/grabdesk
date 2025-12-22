const User = require('../models/User.model');
const Product = require('../models/Product.model');
const { notifyAdminActivity } = require('../utils/adminNotify');
const { uploadProfilePicture, deleteFromCloudinary, isBase64Image } = require('../utils/cloudinary');

// @desc    Upload/Update profile picture
// @route   POST /api/users/profile-picture
// @access  Private
exports.uploadProfilePictureHandler = async (req, res) => {
    try {
        const userId = req.user.id;
        const { image } = req.body;

        // Validate base64 image
        if (!image || !isBase64Image(image)) {
            return res.status(400).json({
                success: false,
                message: 'Valid base64 image required'
            });
        }

        // Find user to get old image public_id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete old image from Cloudinary if exists
        if (user.cloudinaryPublicId) {
            await deleteFromCloudinary(user.cloudinaryPublicId);
        }

        // Upload new image to Cloudinary
        const { url, publicId } = await uploadProfilePicture(image);

        // Update user with new profile picture
        user.profilePhotoUrl = url;
        user.cloudinaryPublicId = publicId;
        await user.save();

        // Return updated user (without password)
        const updatedUser = await User.findById(userId).select('-passwordHash');

        res.json({
            success: true,
            message: 'Profile picture updated successfully',
            profilePhotoUrl: url,
            user: updatedUser
        });
    } catch (error) {
        console.error('Profile Picture Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload profile picture'
        });
    }
};
