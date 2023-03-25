const express = require('express');
const { getHospitals, getHospital, createHospital, updateHospital, deleteHospital, getVacCenters } = require("../controllers/hospitals.js");
// Include other resource routers 
const appointmentRouter = require('./appointments');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');
// Re-route into other resource routers 
router.use('/:hospitalId/appointments/', appointmentRouter);

router.route('/vacCenters').get(getVacCenters);
router.route('/').get(protect,getHospitals).post(protect,authorize('user','admin'), createHospital);
router.route('/:id').get(protect,getHospital).put(protect,authorize('user','admin'), updateHospital).delete(protect, authorize('admin'), deleteHospital);

module.exports=router;