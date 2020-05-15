const express = require('express');
const {
    startAuction,
    enterAuction,
    sellAuction,
    soldCommodities,
    boughtCommodities,
} = require('../controllers/auction');

const router = express.Router();

router.route('/start').post(startAuction);
router.route('/join').post(enterAuction);
router.route('/sell').post(sellAuction);
router.route('/sold').post(soldCommodities);
router.route('/bought').post(boughtCommodities);

module.exports = router;
