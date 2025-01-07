const express = require("express");
const navPurchaseImportCSV = require("../controllers/nav-prurchase-csv-import-controller");
const router = express.Router();

router.post("/purchase-import", navPurchaseImportCSV.import_purchase_csv);

module.exports = router;