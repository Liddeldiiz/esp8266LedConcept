const bcrypt = require('bcryptjs');
const {
    ledSwitchStateRequest, 
    ledStatusRequest
} = require('../middleware/EspApi');

const dashBoardView = (req, res) => {
    res.render('dashboard', {
        
    });
}

const turnLedOn = (req, res) => {
    ledSwitchStateRequest('/led/1', res);
    //const { id, name, date, state } = req.body;
}

const turnLedOff = (req, res) => {
    ledSwitchStateRequest('/led/0', res);
    //const { id, name, date, state } = req.body;
}

module.exports = {
    dashBoardView,
    turnLedOn,
    turnLedOff
};