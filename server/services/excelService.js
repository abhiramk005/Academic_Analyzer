const xlsx = require("xlsx");

async function extractCreditsFromExcel(excelBuffer) {
  const workbook = xlsx.read(excelBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const extractedData = xlsx.utils.sheet_to_json(sheet, { range: 1 }); // skip first row if it's a header

  const previewData = extractedData.map((data) => {
    const regNumber = data.Student?.split("-")[0]?.trim(); // e.g., "WYD18CS001"
    const regBatchMatch = regNumber?.match(/L?WYD(\d{2})/);
    const regBatch = regBatchMatch ? parseInt(regBatchMatch[1]) + 2000 : 0;

    return {
      register_number: regNumber,
      batch: regBatch,
      cumulativeCredits: data["Cumilative Credits"] || 0,
    };
  });

  return previewData;
}

module.exports = {
  extractCreditsFromExcel,
};
