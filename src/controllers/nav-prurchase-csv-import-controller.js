
const prisma = require("../models/prisma");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const createError = require("../utils/create-error");

exports.import_purchase_csv = async (req, res, next) => {
  try {
    const folderPath = "C:/"; // Set the fixed folder path
    const files = fs.readdirSync(folderPath); // Read files from the folder
    const csvFiles = files.filter(file => file.endsWith(".csv")); // Filter CSV files

    if (csvFiles.length === 0) {
      throw createError(400, "No CSV files found in the specified folder.");
    }

    let totalRecords = 0;
    
    for (const file of csvFiles) {
      const filePath = path.join(folderPath, file);
      let recordCount = 0;

      // Parse the CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", () => {
            recordCount++;
          })
          .on("end", () => {
            totalRecords += recordCount;
            resolve();
          })
          .on("error", err => {
            reject(createError(500, `Error reading file ${file}: ${err.message}`));
          });
      });
    }

    res.status(200).json({
      message: "CSV files processed successfully.",
      totalRecords,
      fileCount: csvFiles.length,
    });
  } catch (error) {
    next(error);
  }
};


exports.delete_TT_NAV_Pc_CSV_Upd = async (req, res, next) => {
    
        try {
          
          
          const deletedPc_CSV_Upd = await prisma.tT_NAV_Pc_CSV_Upd.delete({
            where: { Order_No: Order_No }, // ระบุเงื่อนไขในการค้นหา
          });
      
         
          return res
            .status(200)
            .json({ message: "TT_NAV_Pc_CSV_Upd deleted successfully", order: deletedPc_CSV_Upd });
        } catch (err) {
          // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
          console.error("Error deleting TT_NAV_Pc_CSV_Upd:", err);
          return next(createError(500, "Internal Server Error"));
        }
      };
