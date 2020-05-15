const express = require('express');
const { getInterestedCommodities, getOwnCommodities } = require('../controllers/cart');

const router = express.Router();

router.route('/user/interested').post(getInterestedCommodities);
router.route('/user/own').post(getOwnCommodities);

module.exports = router;
