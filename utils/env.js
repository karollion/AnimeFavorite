const required = [
  "NODE_ENV",
  "SESSION_SECRET",
  "CLOUDINARY_CLOUD_NAME"
];

required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing ENV variable: ${key}`);
  }
});