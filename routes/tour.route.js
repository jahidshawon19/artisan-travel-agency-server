const express = require('express')
const tourController = require('../controllers/tour.controller.js')
const viewCount = require('../middlewares/viewCount.js')
const router = express.Router()


router.route("/")
.get(
    tourController.getAllTour
).post(
  tourController.createTour
)

router.route("/:id").get(
   viewCount,  // router level middleware
    tourController.getSingleTour

)

module.exports = router 