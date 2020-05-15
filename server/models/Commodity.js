const mongoose = require('mongoose');

const CommoditySchema = new mongoose.Schema({
    title: String,
    description: String,
    quantity: String,
    basePrice: String,
    date: String,
    imageUrl: String,
    user: {
        _id: String,
        name: String,
        email: String,
        mobileNumber: String,
        jobType: String,
    },
    interestedUsers: {
        type: [
            {
                _id: String,
                name: String,
                email: String,
                mobileNumber: String,
                jobType: String,
            },
        ],
        default: [],
    },
    soldTo: {
        type: {
            _id: String,
            name: String,
            email: String,
            mobileNumber: String,
            jobType: String,
        },
        default: {},
    },
});

module.exports = mongoose.model('Commodity', CommoditySchema);
