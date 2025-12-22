const cloudinary = require('cloudinary').v2;

// Fix for "self-signed certificate in certificate chain" error in development
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

/**
 * Upload base64 image to Cloudinary
 * @param {String} base64Image - Base64 encoded image string
 * @param {String} folder - Cloudinary folder (default: 'products')
 * @returns {Promise<String>} - Cloudinary secure URL
 */
const uploadToCloudinary = async (base64Image, folder = 'products') => {
    try {
        // Upload to Cloudinary with automatic optimization
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: folder,
            resource_type: 'image',
            quality: 'auto',  // Automatic quality optimization
            fetch_format: 'auto',  // Automatic format optimization (WebP, etc.)
            transformation: [
                { width: 800, height: 800, crop: 'limit' },  // Max dimensions
                { quality: 'auto:good' }  // Good quality with compression
            ]
        });

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

/**
 * Upload multiple base64 images to Cloudinary
 * @param {Array<String>} base64Images - Array of base64 encoded images
 * @param {String} folder - Cloudinary folder
 * @returns {Promise<Array<String>>} - Array of Cloudinary secure URLs
 */
const uploadMultipleToCloudinary = async (base64Images, folder = 'products') => {
    try {
        const uploadPromises = base64Images.map(image => uploadToCloudinary(image, folder));
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Multiple Upload Error:', error);
        throw new Error('Failed to upload images to Cloudinary');
    }
};

/**
 * Check if string is a base64 image
 * @param {String} str - String to check
 * @returns {Boolean} - True if base64 image
 */
const isBase64Image = (str) => {
    if (!str || typeof str !== 'string') return false;
    return str.startsWith('data:image/');
};

/**
 * Process images: upload base64 to Cloudinary, keep URLs as-is
 * @param {Array<String>} images - Array of image strings (base64 or URLs)
 * @returns {Promise<Array<String>>} - Array of processed URLs
 */
const processProductImages = async (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
        return [];
    }

    const processedImages = await Promise.all(
        images.map(async (image) => {
            // If it's a base64 image, upload to Cloudinary
            if (isBase64Image(image)) {
                // No try-catch - let errors propagate to controller
                return await uploadToCloudinary(image);
            }
            // If it's already a URL (Unsplash, Cloudinary, etc.), keep it
            return image;
        })
    );

    return processedImages;
};

/**
 * Upload profile picture with optimized compression for avatars
 * @param {String} base64Image - Base64 encoded image
 * @returns {Promise<Object>} - { url: String, publicId: String }
 */
const uploadProfilePicture = async (base64Image) => {
    try {
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'profile_pictures',
            resource_type: 'image',
            quality: 'auto',
            fetch_format: 'auto',
            transformation: [
                { width: 300, height: 300, crop: 'fill', gravity: 'face' },  // Face-focused crop
                { quality: 'auto:good' }  // Good quality with compression
            ]
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Profile Picture Upload Error:', error);
        throw new Error('Failed to upload profile picture');
    }
};

/**
 * Delete image from Cloudinary by public_id
 * @param {String} publicId - Cloudinary public_id
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            return { success: false, message: 'No public ID provided' };
        }

        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        // Don't throw - deletion failure shouldn't block upload
        return { success: false, error: error.message };
    }
};

module.exports = {
    uploadToCloudinary,
    uploadMultipleToCloudinary,
    isBase64Image,
    processProductImages,
    uploadProfilePicture,
    deleteFromCloudinary
};
