import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

if (!env.CLOUDINARY_URL) {
  console.warn(
    '[Warning]: CLOUDINARY_URL is missing from environment variables. Audio uploads will fail.'
  );
}

// Cloudinary automatically picks up the CLOUDINARY_URL from process.env if present,
// but exporting it explicitly allows us to import and use the configured instance.
export default cloudinary;
