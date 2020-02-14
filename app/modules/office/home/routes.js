var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();
var moment = require('moment');

//- SCRIPT FOR CURRENT DATE
var n =  new Date();
var y = n.getFullYear();
var m = n.getMonth() + 1;
var d = n.getDate();
var hr = n.getHours();
var min = n.getMinutes();
var sec = n.getSeconds();
var now = y +"-"+ m +"-"+ d; 

const cron = require("node-cron");
let shell = require("shelljs");

// cron.schedule("*/1 * * * *", function(){
//     console.log("Schedule Running...");
    
//     // if(shell.exec("dir").code !== 0){
//     //     console.log("something went wrong");
//     // }
// });
router.get('/',(req, res) => {
    return res.render('office/home/views/home');
});

module.exports = router;
