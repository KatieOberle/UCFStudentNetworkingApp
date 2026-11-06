// JWT reverification
const authenticationMiddleware = require('../middleware/authenticationMiddleware.js')

// express routing for user reporting
const express = require('express');
const router = express.Router();

const {
    createReport,
    getMyReports,
    getReportsForUser
} = require('../controllers/reportsController'); // link to controller

router.post('/path', authenticationMiddleware, createReport); // post report
router.get('/path', authenticationMiddleware, getMyReports); // get reports info
router.get('/path', authenticationMiddleware, getReportsForUser); // admin retrieval of user reports

module.exports = router;
