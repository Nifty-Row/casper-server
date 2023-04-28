const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: "niftyrow",
  api_key: "912746979379384",
  api_secret: "UQ0dhdfpTHP7BFUjwXdVAYXruiE",
});

// Upload file
async function uploadToCloudinary(fileLocalPath) {
  try {
    const result = await cloudinary.uploader.upload(fileLocalPath);
    fs.unlinkSync(fileLocalPath);

    return result.secure_url;
  } catch (error) {
    console.error(error);
    return "";
  }
}

module.exports = uploadToCloudinary;
