const express = require('express');
const {
    createCommodity,
    getCommodity,
    getUserCommodity,
    interestedInBidding,
    getSearchCommodity,
} = require('../controllers/commodity');
const multer = require('multer');

const UPLOAD_FILE_PATH = './public/uploads';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FILE_PATH);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    },
});

let upload = multer({
    storage: storage,
});

const router = express.Router();

router.route('/create').post(createCommodity);
router.route('/user/interested').post(interestedInBidding);
router.route('/user/:endCount').post(getUserCommodity);
router.route('/search/:endCount').post(getSearchCommodity);
router.route('/upload').post(upload.single('image'), function (req, res) {
    console.log(req.file);
    if (!req.file) {
        console.log('No file is available!');
        return res.send({
            success: false,
            reason: 'No file is available!',
        });
    } else {
        console.log('File is available!');
        return res.send({
            success: true,
            reason: 'File is available!',
            filePath: req.file.path,
        });
    }
});
router.route('/:endCount').post(getCommodity);

module.exports = router;
