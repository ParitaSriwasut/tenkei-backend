const express = require("express");
const tdSorderController = require("../controllers/td-sorder-controller");
const router = express.Router();

router.get("/check-sorder", tdSorderController.formLoad);
router.post("/search-sorder", tdSorderController.Search_SOrder_No_AfterUpdate);

router.get("/customer-info", tdSorderController.get_customer_info_SOrder);
router.get("/unit", tdSorderController.get_unit_SOrder);
router.get("/od-quote", tdSorderController.get_od_quote_SOrder);
router.get("/currency", tdSorderController.get_currency_SOrder);
router.get("/contract-docu", tdSorderController.get_contract_docu_SOrder);

router.post("/create-sorder", tdSorderController.post_createSOrder);

router.put("/edit-sorder", tdSorderController.edit_SOrder);
router.delete("/delete-sorder", tdSorderController.delete_SOrder);

module.exports = router;