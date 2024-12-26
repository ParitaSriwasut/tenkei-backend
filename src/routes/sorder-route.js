const express = require("express");
const tdSorderController = require("../controllers/td-sorder-controller");
const router = express.Router();

router.get("/check-sorder", tdSorderController.formLoad);
router.post("/search-sorder", tdSorderController.Search_SOrder_No_AfterUpdate);

module.exports = router;