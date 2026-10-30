
// express routing for user reporting
const express = require('express');
const router = express.Router();

const {
    createReport
} = require('../controllers/reportsController'); // link to controller

router.post('/', createReport); // post report

module.exports = router;
