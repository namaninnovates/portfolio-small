import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadToCloudinary(fileBuffer, mimeType) {
  return new Promise((resolve, reject) => {
    const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: 'portfolio' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
}
