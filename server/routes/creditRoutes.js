// routes/credit.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { handleCreditPreview, handleCreditUpload } = require("../controllers/creditController");

router.post("/preview-credit", upload.single("file"), handleCreditPreview);
router.post("/upload-credit", handleCreditUpload);

module.exports = router;
