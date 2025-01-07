const express = require("express");
const NavOrderCsvController = require("../controllers/nav-order-csv-controller");
const router = express.Router();

router.get("/fetch-nav-order-csv-upd", NavOrderCsvController.fetchtt_order_csv_upd);
router.get("/fetch-nav-order-csv", NavOrderCsvController.fetchtt_order_csv);
router.post("/TT_NAV_Od_CSV", NavOrderCsvController.TT_NAV_Od_CSV);
router.post("/QT_NAV_Od_CSV_Upd_Add", NavOrderCsvController.QT_NAV_Od_CSV_Upd_Add);
router.post("/QT_NAV_Od_CSV_Upd_Upd", NavOrderCsvController.QT_NAV_Od_CSV_Upd_Upd);
router.post("/QT_NAV_Od_CSV_Add", NavOrderCsvController.QT_NAV_Od_CSV_Add);

module.exports = router;