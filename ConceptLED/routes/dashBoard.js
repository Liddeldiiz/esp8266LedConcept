//import { express } from 'express';

const { 
    dashBoardView, 
    turnLedOn, 
    turnLedOff 
} = require('../controllers/dashBoardController.js');

const express = require('express');
const router = express.Router();

router.get('/', dashBoardView);

router.get('/turnOn', dashBoardView);
router.get('/turnOff', dashBoardView);


router.post('/turnOn', turnLedOn);
router.post('/turnOff', turnLedOff);

module.exports = router;