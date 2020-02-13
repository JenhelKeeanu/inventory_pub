var express = require('express');
var homepage = express.Router();
var signup = express.Router();
var logoutRouter = express.Router();
var authMiddleware = require('./middlewares/auth');
var db = require('../../lib/database')();

//- SCRIPT FOR CURRENT DATE
var n =  new Date();
var y = n.getFullYear();
var m = n.getMonth() + 1;
var d = n.getDate();
var hr = n.getHours();
var min = n.getMinutes();
var sec = n.getSeconds();
var now = y +"-"+ m +"-"+ d; 

homepage.get('/',authMiddleware.noAuthed,(req, res) => {
    res.render('auth/views/index');
});

homepage.post('/', (req, res) =>{
    console.log('POST: Home Modal');

    var db = require('../../lib/database')();
    db.query(`SELECT * FROM user WHERE username="${req.body.user_email}"`, (err, results, fields) => {
        if (err) throw err;
        if (results.length === 0) return res.redirect('/login?incorrect');

        var user = results[0];
        
        if (user.password !== req.body.user_password) return res.redirect('/login?incorrect');
        req.session.office = user;
        return res.redirect('/office/home');
        // if(user.enum_userType == "Office Staff"){
        //     delete user.varchar_userPassword;
        //     req.session.office = user;
        //     console.log('Office Staff User:');
        //     return res.redirect('/office/home');
        // }

        // if(user.enum_userType == "Barangay Staff"){
        //     delete user.varchar_userPassword;
        //     req.session.barangay = user;
        //     console.log('Barangay Staff User:');
        //     return res.redirect('/barangay/home');
        // }

        // if(user.enum_userType == "Budget Office Staff"){
        //     delete user.varchar_userPassword;
        //     req.session.budget = user;
        //     console.log('Budget Staff User:');
        //     return res.redirect('/budget/home');
        // }

    });

});
// ----End login student


logoutRouter.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        console.log("===========================");
        console.log("Router: LOG OUT");
        console.log("===========================");
        res.redirect('/home');
    });
});



exports.home = homepage;
exports.signup = signup;
exports.logout = logoutRouter;