// JWT reverification
const authMiddleware = require('../middleware/authMiddleware.js')

// express routing for user reporting
const express = require('express');
const router = express.Router();

const {
    createReport,
    getMyReports
} = require('../controllers/reportsController'); // link to controller

router.post('/path', authMiddleware, createReport); // post report
router.get('/mine', authMiddleware, getMyReports); // get reports info

module.exports = router;
