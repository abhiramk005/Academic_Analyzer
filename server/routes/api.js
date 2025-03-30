const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { previewResults } = require("../controllers/previewController");
const { uploadResults } = require("../controllers/uploadController");

router.post("/preview", upload.single("file"), previewResults);
router.post("/upload", uploadResults);

module.exports = router;