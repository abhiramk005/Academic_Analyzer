const fs = require("fs");
const { extractAndConvertToJson } = require("../services/pdfService");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../utils/constants");

async function previewResults(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: ERROR_MESSAGES.NO_FILE });
    if (!req.body.batch) return res.status(400).json({ error: ERROR_MESSAGES.BATCH_REQUIRED });

    const selectedBatch = parseInt(req.body.batch);
    const pdfBuffer = fs.readFileSync(req.file.path);
    const extractedData = await extractAndConvertToJson(pdfBuffer);

    const selectedSemester = parseInt(req.body.semester.replace("Semester ", ""));
    const resultType = req.body.resultType;

    const previewData = extractedData.map((data) => {
      const regBatchMatch = data.id.match(/WYD(\d{2})/);
      const regBatch = regBatchMatch ? parseInt(regBatchMatch[1]) + 2000 : 0;
      const isRegularStudent = regBatch === selectedBatch;

      return {
        register_number: data.id,
        batch: regBatch,
        isRegularStudent,
        subjects: Object.entries(data)
          .filter(([key]) => key !== "id")
          .map(([code, grade]) => ({ code, grade })),
      };
    });

    fs.unlinkSync(req.file.path);
    res.json({
      previewData,
      semester: selectedSemester,
      resultType,
      message: SUCCESS_MESSAGES.PREVIEW_SUCCESS,
    });
  } catch (error) {
    console.error(error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
  }
}

module.exports = {
  previewResults,
};