const express = require("express")
const statusController = require("../controllers/fmn-status-controller")
const tmOdprogressController = require("../controllers/tm-odprogress-controller")
const tmCsProgressController = require("../controllers/tm-csprogress-controller")
const tmPlprogressController = require("../controllers/tm-plprogress-controller")
const router = express.Router()

router.get("/customer-all", statusController.get_short_customer_info)

//โชว์ข้อมูลทั้งหมด 0-9
// frontend ต้อง filter ในการแสดงทั้งสองช่่องนี้โดยใช้ endpoint เส้นเดียวกัน
// ช่อง order progress สีน้ำเงิน filter แสดงแค่ Od_Progress_Symbol, Od_Progress_Remark
// ช่อง Old_Od_Progress filter แสดงแค่ Od_Progress_CD, Od_Progress_Abb, Od_Progress_Remark
router.get("/odprogress-all", tmOdprogressController.fetchOdprogress)

// ช่อง Old_Pl_Progress filter แสดงแค่ Pl_Progress_CD, Pl_Progress_Abb, Pl_Progress_Remark
router.get("/plprogress-all", tmPlprogressController.fetchPlprogress)

// ช่อง Old_Cs_Progress filter แสดงแค่ Cs_Progress_CD, Cs_Progress_Abb, Cs_Progress_Remark
router.get("/fetch-csprogress", tmCsProgressController.fetchCsProgress)

module.exports = router
