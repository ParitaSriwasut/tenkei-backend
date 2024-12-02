const express = require("express");
const tmResourceController = require("../controllers/tm-resource-controller");
const router = express.Router();

router.get("/fetch-resource", tmResourceController.fetchResource);
router.put("/update-resource", tmResourceController.updateResource);

module.exports = router;