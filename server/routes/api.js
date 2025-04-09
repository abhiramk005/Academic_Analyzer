const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { previewResults } = require("../controllers/previewController");
const { uploadResults } = require("../controllers/uploadController");
const { previewCreditResult } = require("../controllers/creditController")

router.post("/preview", upload.single("file"), previewResults);
router.post("/upload", uploadResults);
router.post("/credit-preview",upload.single("file"),previewCreditResult);


module.exports = router;