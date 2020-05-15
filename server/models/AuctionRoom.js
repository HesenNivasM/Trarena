const mongoose = require('mongoose');

const CommoditySchema = new mongoose.Schema({
    roomId: String,
    status: Boolean,
    commodity: {
        _id: String,
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
    },
    messages: {
        type: [
            {
                user: {
                    _id: String,
                    name: String,
                    email: String,
                    mobileNumber: String,
                    jobType: String,
                },
                message: String,
                date: String,
            },
        ],
        default: [],
    },
    members: {
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
    date: String,
});

module.exports = mongoose.model('AuctionRoom', CommoditySchema);
