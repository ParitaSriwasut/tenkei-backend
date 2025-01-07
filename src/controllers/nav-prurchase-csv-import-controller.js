const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.import_purchase_csv = async (req, res, next) => {
  try {
    // Step 1: Delete all records in the table before processing CSV files
    const deletedRecords = await this.delete_TT_NAV_Pc_CSV_Upd(req, res, next);
    
    // Step 2: Process the CSV files and count the records
    const folderPath = "C:/"; // Set the fixed folder path
    const backupFolderPath = "C:/TENKEI/Purchase_CSV/BK"; // Set the backup folder path
    const files = fs.readdirSync(folderPath); // Read files from the folder
    const csvFiles = files.filter(file => file.endsWith(".csv")); // Filter CSV files

    if (csvFiles.length === 0) {
      throw createError(400, "No CSV files found in the specified folder.");
    }

    let totalRecords = 0;

    // Step 3: Loop through each CSV file and count the records
    let fileIndex = 1; // Counter to print the loop as 1.. 2.. 3..
    for (const file of csvFiles) {
      const filePath = path.join(folderPath, file);
      const backupFilePath = path.join(backupFolderPath, file); // Backup file path
      let recordCount = 0;

      console.log(`Processing file ${fileIndex}...`); // Print the current file index (1.. 2.. 3..)

      // Parse the CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", () => {
            recordCount++;
          })
          .on("end", () => {
            totalRecords += recordCount;
            console.log(`File ${fileIndex} processed, found ${recordCount} records.`);

            // Copy the CSV file to the backup folder
            try {
              fs.copyFileSync(filePath, backupFilePath);
              console.log(`File ${fileIndex} backed up successfully to ${backupFilePath}`);
            } catch (copyErr) {
              console.error(`Error copying file ${file}: ${copyErr.message}`);
            }

            fileIndex++; // Increment the file counter
            resolve();
          })
          .on("error", err => {
            reject(createError(500, `Error reading file ${file}: ${err.message}`));
          });
      });
    }

    // Return the response with the count of deleted records and CSV records
    res.status(200).json({
      message: "CSV files processed successfully.",
      totalRecords,
      fileCount: csvFiles.length,
      deletedCount: deletedRecords.count, // Show deleted records count
    });
  } catch (error) {
    next(error);
  }
};

exports.delete_TT_NAV_Pc_CSV_Upd = async (req, res, next) => {
  try {
    // Step 1: Delete all records in the table
    const deletedRecords = await prisma.tT_NAV_Pc_CSV_Upd.deleteMany();

    return {
      count: deletedRecords.count, // Return the count of deleted records
    };
  } catch (err) {
    // Log the error for debugging
    console.error("Error deleting TT_NAV_Pc_CSV_Upd:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
