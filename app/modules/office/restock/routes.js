var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();
var moment = require("moment");

router.get('/',(req, res) => {
    console.log("nice");
    res.render('office/restock/views/restock');
});


module.exports = router;
