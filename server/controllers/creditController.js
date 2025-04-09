const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const CreditResult = require('../models/CreditResult');
const { extractCreditsFromExcel } = require("../services/excelService")

async function previewCreditResult(req, res){
  try {
    const file = req.file;
    //const { batch } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'Batch and file are required' });
    }

    const excelBuffer = req.file.buffer;
    const creditpreviewData = await extractCreditsFromExcel(excelBuffer);
    const selectedSemester = parseInt(req.body.semester.replace("Semester ", ""));
    const credit = req.body.cumilativeCredit;
    const preview = creditpreviewData.map((data)=>{
      const regBatchMatch = data.id.match(/WYD(\d{2})/);
      const regBatch = regBatchMatch ? parseInt(regBatchMatch[1]) + 2000 : 0;
      

      return{
        register_number: data.id,
        batch: regBatch,
        semester:semester,
        cumilativeCredit: credit,
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
};

module.exports={
  previewCreditResult,
}

// exports.uploadCreditResult = async (req, res) => {
//   try {
//     const { studentsData, batch } = req.body;

//     if (!studentsData || !Array.isArray(studentsData)) {
//       return res.status(400).json({ message: 'Invalid students data' });
//     }

//     for (const student of studentsData) {
//       await CreditResult.updateOne(
//         { register_number: student.register_number },
//         {
//           $set: {
//             register_number: student.register_number,
//             batch,
//             cumulativeCredits: student.cumulativeCredits,
//           },
//         },
//         { upsert: true }
//       );
//     }

//     res.json({ message: "Credit results uploaded successfully" });
//   } catch (error) {
//     console.error("Credit Upload Error:", error);
//     res.status(500).json({ message: "Failed to upload credit results" });
//   }
// };
