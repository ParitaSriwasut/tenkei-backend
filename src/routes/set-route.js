const express = require("express");
const tsSetController = require("../controllers/ts-set-controller");
const router = express.Router();

router.get("/fetch-set", tsSetController.fetchSet);
router.put("/update-set", tsSetController.updateSet);

module.exports = router;