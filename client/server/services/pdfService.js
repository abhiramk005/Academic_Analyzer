const pdfParse = require("pdf-parse");
const fs = require("fs");

async function extractAndConvertToJson(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  let text = data.text.replace(/\n/g, " ");

  const registerPattern = /(L?WYD\d{2}[A-Z]{2,3}\d{3}).*?(?=L?WYD\d{2}[A-Z]{2,3}\d{3}|$)/g;
  const matches = text.match(registerPattern);

  if (!matches) throw new Error("No matching register numbers found.");

  return matches.map((line) => {
    line = line.trim();
    const registerNumberMatch = line.match(/L?WYD\d{2}[A-Z]{2,3}\d{3}/);
    if (!registerNumberMatch) throw new Error("Invalid register number format.");

    const registerNumber = registerNumberMatch[0];
    const restPart = line.slice(registerNumber.length).trim();

    const subjects = {};
    restPart.split(/\s+/).forEach((subjectInfo) => {
      const match = subjectInfo.match(/([A-Z0-9]+)\((.*?)\)/);
      if (match) {
        const [subject, grade] = match.slice(1, 3);
        subjects[subject] = grade;
      }
    });

    return { id: registerNumber, ...subjects };
  });
}

module.exports = {
  extractAndConvertToJson,
};