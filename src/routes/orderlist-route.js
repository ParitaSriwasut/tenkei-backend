const express = require("express");
const tdOrderListController = require("../controllers/td-orderlist-controller");
const router = express.Router();

router.post("/fecth-orderlist", tdOrderListController.Show_action);



module.exports = router;