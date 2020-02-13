var router = require('express').Router();
var authMiddleware = require('../auth/middlewares/auth');

router.use(authMiddleware.hasAuthOffice);

router.use('/home', require('./home/routes'));
router.use('/inventory', require('./inventory/routes'));
router.use('/restock', require('./restock/routes'));
router.use('/waste', require('./waste/routes'));
router.use('/orders', require('./orders/routes'));
router.use('/report', require('./report/routes'));


exports.office = router;