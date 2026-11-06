// JWT reverification
const authenticationMiddleware = require('../middleware/authMiddleware.js')

// express routing for user reporting
const express = require('express');
const router = express.Router();

const {
    createReport,
    getMyReports,
    getReportsForUser
} = require('../controllers/reportsController'); // link to controller

router.post('/path', authMiddleware, createReport); // post report
router.get('/mine', authMiddleware, getMyReports); // get reports info
router.get('/user/:userId', authMiddleware, getReportsForUser); // admin retrieval of user reports

module.exports = router;
