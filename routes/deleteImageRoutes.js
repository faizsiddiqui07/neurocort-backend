const express = require('express')
const cloudinary = require("cloudinary");
const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "daf8kxmia",
  api_key: 362161735919762,
  api_secret: 'Nj7WfRS7KlYbD8Dnqi5xYn4WoLE', 
});

// Delete Image Route
router.post("/api/delete-image", async (req, res) => {
    
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ error: "Missing public_id" });
    }

    // Delete image from Cloudinary
    const result = await cloudinary.v2.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return res.status(500).json({ error: "Failed to delete image" });
    }

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router
