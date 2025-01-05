const express = require("express");
const tmCurrencyController = require("../controllers/tm-currency-controller");
const router = express.Router();

router.get("/fetch-currency", tmCurrencyController.fetchCurrency);

module.exports = router;