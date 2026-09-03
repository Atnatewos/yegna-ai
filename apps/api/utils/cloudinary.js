/**
 * File: apps/api/utils/cloudinary.js
 * Yegna AI - Cloudinary Configuration
 * 
 * Configures Cloudinary for file uploads and management.
 */

const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary with environment variables
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload a file to Cloudinary
 * 
 * @param {string} filePath - Path or base64 of file
 * @param {object} options - Upload options
 * @returns {Promise<object>} Upload result
 * 
 * @throws {Error} Upload error
 */
async function uploadFile(filePath, options = {}) {
  try {
    const defaultOptions = {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'yegna_ai',
      resource_type: 'auto',
      ...options
    };
    
    const result = await cloudinary.uploader.upload(filePath, defaultOptions);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
}

/**
 * Delete a file from Cloudinary
 * 
 * @param {string} publicId - Public ID of file to delete
 * @returns {Promise<object>} Deletion result
 */
async function deleteFile(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`File deletion failed: ${error.message}`);
  }
}

/**
 * Generate a signed upload URL for client-side uploads
 * 
 * @param {object} options - Upload options
 * @returns {object} Signed upload details
 */
function generateUploadSignature(options = {}) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  const params = {
    timestamp,
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'yegna_ai',
    ...options
  };
  
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET
  );
  
  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY
  };
}

/**
 * Generate a URL for a Cloudinary asset
 * 
 * @param {string} publicId - Public ID of the asset
 * @param {object} options - URL transformation options
 * @returns {string} Cloudinary URL
 */
function generateUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    secure: true,
    ...options
  });
}

module.exports = {
  cloudinary,
  uploadFile,
  deleteFile,
  generateUploadSignature,
  generateUrl
};