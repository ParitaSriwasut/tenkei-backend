const express = require("express");
const tmVendorController = require("../controllers/tm-vendor-controller");
const router = express.Router();

router.get("/fetch-vendor", tmVendorController.fetchVendor);
router.put("/update-vendor", tmVendorController.updateVendor);

module.exports = router;