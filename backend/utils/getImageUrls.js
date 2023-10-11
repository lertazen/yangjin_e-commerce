import { cloudinary } from '../config/cloudinaryConfig.js';
import path from 'path';

const getImageUrls = async (files) => {
  try {
    const imageUrls = await Promise.all(
      files.map((file) => {
        const filename = path.parse(file.originalname).name;
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: 'auto',
                use_filename: true,
                public_id: filename,
              },
              (error, result) => {
                if (error) {
                  console.error('Error uploading to Cloudinary:', error);
                  reject(error);
                }
                resolve(result.secure_url);
              }
            )
            .end(file.buffer);
        });
      })
    );
    return imageUrls;
  } catch (err) {
    console.error('Error in getImageUrls:', err);
    throw err;
  }
};

export { getImageUrls };
