const express = require("express");
const NavOrderCsvController = require("../controllers/nav-csv-purchase-import-variant");

const router = express.Router();

router.get("/fetch-nav-order-csv-upd", NavOrderCsvController.fetchtt_purchase_csv);
router.get("/fetch-nav-order-csv", NavOrderCsvController.fetchtt_purchase_csv);

router.post("/TT_NAV_Pc_CSV", NavOrderCsvController.TT_NAV_PC_CSV);
router.post("/QT_NAV_Pc_CSV_Upd_Add", NavOrderCsvController.QT_NAV_Pc_CSV_Upd_Add);
router.post("/QT_NAV_Pc_CSV_Upd_Upd", NavOrderCsvController.QT_NAV_Pc_CSV_Upd_Upd);
router.post("/QT_NAV_Pc_CSV_Add", NavOrderCsvController.QT_NAV_Pc_CSV_Add);
router.post("/QT_NAV_Pc_CSV_Upd_Ref", NavOrderCsvController.QT_NAV_Pc_CSV_Upd_Ref);
router.get("/RD_NAV_Pc_Upd_Ref", NavOrderCsvController.RD_NAV_Pc_Upd_Ref);  


module.exports = router;