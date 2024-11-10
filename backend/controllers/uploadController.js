import ExcelData from "../models/dataModel.js";
import async from "async";
import xlsx from "xlsx";

const excelDateToJSDate = (excelDate) => {
  // Excel dates are stored as days from 1st Jan 1900
  const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
  return jsDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const saveRowToDB = (row, callback) => {
  ExcelData.findOne({ Email: row.Email }) // Check if a document with the same Email exists
    .then((existingDoc) => {
      if (existingDoc) {
        console.log(
          `Duplicate found for Email: ${row.Email}, skipping insertion.`
        );
        return callback(null); // Skip this row and continue to the next one
      } else {
        // If no duplicate is found, create a new document
        return ExcelData.create(row)
          .then(() => callback(null)) // Successfully inserted, move to the next row
          .catch((error) => callback(error)); // Pass any insertion error to the callback
      }
    })
    .catch((error) => callback(error)); // Handle any error in the duplicate check query
};

const uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Load the file buffer and read Excel file content

    const workbook = xlsx.read(req.files.file.data);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = sheetData.map((row) => {
      if (typeof row["Date of Birth"] === "number") {
        row["Date of Birth"] = excelDateToJSDate(row["Date of Birth"]);
      }
      row["Mobile No."] = String(row["Mobile No."]);
      return row;
    });

    // console.log("Workbook", workbook);
    // console.log("SheetData", sheetData);

    // Filter out duplicates by Email
    const uniqueData = Array.from(
      new Map(formattedData.map((item) => [item.Email, item])).values()
    );

    // Insert data into MongoDB
    async.eachSeries(uniqueData, saveRowToDB, (err) => {
      if (err) {
        console.error("Error:", err);
        return res.status(400).json({ message: "Failed to save data" });
      }
      res.status(201).json({ message: "File uploaded and data stored" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { uploadFile };
