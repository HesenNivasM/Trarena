const AuctionRoom = require('./../models/AuctionRoom');
const Commodity = require('./../models/Commodity');

exports.startAuction = async (req, res, next) => {
    try {
        const data = await req.body;
        const commodityData = await data.commodity;
        const userData = await data.user;

        let auctionRoom = {};
        auctionRoom['roomId'] = commodityData._id;
        auctionRoom['status'] = true;
        auctionRoom['commodity'] = commodityData;
        auctionRoom['messages'] = [];
        auctionRoom['members'] = [];
        auctionRoom['date'] = new Date();

        console.log(auctionRoom);
        try {
            const findAuctionRoom = await AuctionRoom.findOne(
                {
                    roomId: auctionRoom.roomId,
                },
                async (err, aucRoom) => {
                    if (err) {
                        console.error(err);
                        res.status(201).json({ success: false, reason: 'No document found' });
                    } else if (aucRoom) {
                        return res.status(201).json({
                            success: false,
                            reason: 'exists',
                        });
                    } else {
                        // No doc exist
                        try {
                            const createAuctionRoom = await AuctionRoom.create(
                                auctionRoom,
                                (err, doc) => {
                                    if (err) {
                                        console.error(err);
                                        res.status(201).json({
                                            success: false,
                                            reason: 'Error creating document',
                                        });
                                    } else if (doc) {
                                        return res.status(201).json({
                                            success: true,
                                            reason: 'success',
                                            auctionRoomData: auctionRoom,
                                        });
                                    }
                                }
                            );
                        } catch (err) {
                            console.error(err);
                            res.status(201).json({ success: false, reason: 'Server Error' });
                        }
                    }
                }
            );
        } catch (err) {
            console.error(err);
            res.status(201).json({ success: false, reason: 'Server Error' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};

exports.enterAuction = async (req, res, next) => {
    try {
        const data = await req.body;
        const commodityData = await data.commodity;
        const userData = await data.user;

        try {
            const findAuctionRoom = await AuctionRoom.findOne(
                {
                    roomId: commodityData._id,
                },
                async (err, aucRoom) => {
                    if (err) {
                        console.error(err);
                        res.status(201).json({ success: false, reason: 'No document found' });
                    } else if (aucRoom) {
                        console.log('Room exits and the user can join the room');
                        return res.status(201).json({
                            success: true,
                            reason: 'success',
                            auctionRoomData: aucRoom,
                        });
                    }
                }
            );
        } catch (err) {
            console.error(err);
            res.status(201).json({ success: false, reason: 'Server Error' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};

exports.sellAuction = async (req, res, next) => {
    console.log('ca;;ed');
    try {
        const data = await req.body;
        const auctionRoom = await data.auctionRoom;
        const userData = await data.sellToUser;
        console.log('Sell Auction');
        console.log(data);

        // Mark the status as false in the auctionRoom
        const auctionRoomData = await AuctionRoom.findOne({ roomId: auctionRoom.commodity._id });
        auctionRoomData.status = false;
        auctionRoomData.save();

        // Mark the commodity sold to the user
        const commodityData = await Commodity.findOne({ _id: auctionRoom.roomId });
        commodityData.soldTo = userData;
        console.log(commodityData);
        commodityData.save();

        return res.status(201).json({
            success: true,
            reason: 'Success',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};

exports.soldCommodities = async (req, res, next) => {
    try {
        const user = await req.body.user;
        let data = [];
        // Get the commodities the user sold
        const commodities = await Commodity.find({ user: user });
        commodities.forEach((commodity) => {
            if (commodity.soldTo && commodity.soldTo._id) {
                data.push(commodity);
            }
        });
        return res.status(201).json({
            success: true,
            reason: 'Success',
            commodityData: data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};

exports.boughtCommodities = async (req, res, next) => {
    try {
        const user = await req.body.user;
        // Get the commodities the user sold
        const commodities = await Commodity.find({ soldTo: user });
        return res.status(201).json({
            success: true,
            reason: 'Success',
            commodityData: commodities,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};
