const cloudinary = require("cloudinary").v2;

module.exports = function (req, res, next) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  cloudinary.uploader.upload(req.file.path, options, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error uploading image to Cloudinary" });
    }

    // Return the URL of the uploaded image
    req.file.location = result.secure_url;
    console.log(req.file.location, "lo");
    next();
  });
};
