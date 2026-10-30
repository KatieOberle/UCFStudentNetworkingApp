
// express routing for user reporting
const express = require('express');
const router = express.Router();

const {
    createReport,
    getMyReports,
    getReportsForUser
} = require('../controllers/reportsController'); // link to controller

router.post('/', createReport); // post report
router.get('/me', getMyReports); // get reports info
router.get('/user/:userId', getReportsForUser); // admin retrieval of user reports

module.exports = router;
