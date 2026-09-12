import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

async function uploadImage({ image, folder = 'ai-project/products' }) {
  if (!image || typeof image !== 'string') {
    throw new Error('An image data URL, base64 string, or URL is required');
  }

  const options = { folder, resource_type: 'image' };
  const result = image.startsWith('data:')
    ? await uploadBuffer(Buffer.from(image.split(',')[1], 'base64'), options)
    : image.startsWith('http://') || image.startsWith('https://')
      ? await cloudinary.uploader.upload(image, options)
      : await uploadBuffer(Buffer.from(image, 'base64'), options);

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

export { uploadImage };