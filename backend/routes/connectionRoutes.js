const express = require('express');
const router = express.Router();

const connectionController = require('../controllers/connectionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request/:userId', authMiddleware, connectionController.sendRequest);
router.patch('/accept/:userId', authMiddleware, connectionController.acceptRequest);
router.patch('/decline/:userId', authMiddleware, connectionController.declineRequest);
router.get('/requests', authMiddleware, connectionController.getRequests);
router.get('/user/:userId', authMiddleware, connectionController.getConnections);

module.exports = router;
