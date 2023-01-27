const express = require('exrpess');

const { 
    dashBoardView, 
    turnLedOn, 
    turnLedOff 
} = require('../controllers/dashBoardController.js');

const router = express.Router();

router.get('/turnOn', dashBoardView);
router.get('/turnOff', dashBoardView);


router.post('/turnOn', turnLedOn);
router.post('/turnOff', turnLedOff);

module.exports = router;