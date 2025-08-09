import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for temporary storage
const upload = multer({ dest: "temp/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "test-questions",
    });

    // Delete the temp file
    fs.unlinkSync(filePath);

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

export default router;
