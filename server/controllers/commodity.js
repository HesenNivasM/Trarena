const Commodity = require('./../models/Commodity');

exports.createCommodity = async (req, res, next) => {
    try {
        const receivedCommodity = await req.body;
        const createCommodity = await Commodity.create(receivedCommodity, (err, commodity) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    reason: 'Server error',
                });
            } else {
                return res.status(201).json({
                    success: true,
                    reason: 'Commodity created Successfully',
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};

exports.interestedInBidding = async (req, res, next) => {
    const receivedCommodity = await req.body.commodityData;
    const interested = await req.body.interested;
    const currentUser = await req.body.userData;
    let finalizedCommodity = receivedCommodity;
    if (interested) {
        // If the user is interested, insert the user in the list
        let elementPresent = false;
        finalizedCommodity.interestedUsers.forEach((user) => {
            if (user._id === currentUser._id) {
                elementPresent = true;
            }
        });
        if (elementPresent) {
            // User is already present
        } else {
            // Insert the user in the list
            finalizedCommodity.interestedUsers.push(currentUser);
        }
    } else {
        // If the user is not interested, remove the user from the list
        let elementPresent = false;
        finalizedCommodity.interestedUsers.forEach((user) => {
            if (user._id === currentUser._id) {
                elementPresent = true;
            }
        });
        if (!elementPresent) {
            // User is already present
        } else {
            // Insert the user in the list
            finalizedCommodity.interestedUsers = finalizedCommodity.interestedUsers.filter(
                (item) => item._id !== currentUser._id
            );
        }
    }

    try {
        const findCommodity = await Commodity.findOne(
            {
                title: receivedCommodity.title,
                description: receivedCommodity.description,
                quantity: receivedCommodity.quantity,
                basePrice: receivedCommodity.basePrice,
                user: receivedCommodity.user,
            },
            (err, commodity) => {
                if (err) {
                    console.error(err);
                    res.status(201).json({ success: false, reason: 'No document found' });
                } else if (commodity) {
                    // console.log(commodity);
                    const data = commodity;
                    data.interestedUsers = finalizedCommodity.interestedUsers;
                    data.save();
                    return res.status(201).json({
                        success: true,
                        reason: 'Commodity updated Successfully',
                        interestedUsers: finalizedCommodity.interestedUsers,
                    });
                } else {
                    console.error(err);
                    res.status(201).json({ success: false, reason: 'Server Error' });
                }
            }
        );
    } catch (err) {
        console.error(err);
        res.status(201).json({ success: false, reason: 'Server Error' });
    }
};

exports.getUserCommodity = async (req, res, next) => {
    try {
        const noOfElements = 12;
        const endCount = req.params.endCount;

        const currentUser = await req.body;

        const commodities = await Commodity.find({ user: currentUser }, (err, docs) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    reason: 'Server error',
                });
            } else {
                return res.status(201).json({
                    success: true,
                    reason: 'Commodity created Successfully',
                    count: docs.length,
                    commodityData: docs
                        .sort((a, b) => {
                            let _idA = new Date(parseInt(a._id.toString().slice(0, 8), 16) * 1000),
                                _idB = new Date(parseInt(b._id.toString().slice(0, 8), 16) * 1000);
                            if (_idA < _idB) return 1;
                            if (_idA > _idB) return -1;
                            return 0;
                        })
                        .slice(endCount - noOfElements, endCount),
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};

exports.getCommodity = async (req, res, next) => {
    try {
        const noOfElements = 12;
        const endCount = req.params.endCount;

        const currentUser = await req.body;

        const commodities = await Commodity.find({ user: { $nin: [currentUser] } }, (err, docs) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    reason: 'Server error',
                });
            } else {
                return res.status(201).json({
                    success: true,
                    reason: 'Commodity created Successfully',
                    count: docs.length,
                    commodityData: docs
                        .sort((a, b) => {
                            let _idA = new Date(parseInt(a._id.toString().slice(0, 8), 16) * 1000),
                                _idB = new Date(parseInt(b._id.toString().slice(0, 8), 16) * 1000);
                            if (_idA < _idB) return 1;
                            if (_idA > _idB) return -1;
                            return 0;
                        })
                        .slice(endCount - noOfElements, endCount),
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};

exports.getSearchCommodity = async (req, res, next) => {
    try {
        const noOfElements = 12;
        const endCount = req.params.endCount;

        const currentUser = await req.body.userData;
        const searchCategory = await req.body.searchFactors.searchCategory.toLowerCase();
        const searchQuery = await req.body.searchFactors.searchQuery;
        let commodities;
        console.log('searchCategory', searchCategory);
        if (searchCategory === 'from farmer' || searchCategory === 'from trader') {
            commodities = await Commodity.find(
                {
                    user: { $nin: [currentUser] },
                },
                (err, docs) => {
                    console.log('Request Success', docs);
                    if (err) {
                        res.status(500).json({
                            success: false,
                            reason: 'Server error',
                        });
                    } else {
                        const finalizedDocs = [];
                        if (searchCategory === 'from farmer') {
                            docs.forEach((doc) => {
                                if (doc.user.jobType === 'Farmer') {
                                    finalizedDocs.push(doc);
                                }
                            });
                        } else {
                            docs.forEach((doc) => {
                                if (doc.user.jobType === 'Trader') {
                                    finalizedDocs.push(doc);
                                }
                            });
                        }
                        console.log('finalizedDocs');
                        console.log(finalizedDocs);
                        return res.status(201).json({
                            success: true,
                            reason: 'Commodity created Successfully',
                            count: finalizedDocs.length,
                            commodityData: finalizedDocs
                                .sort((a, b) => {
                                    let _idA = new Date(
                                            parseInt(a._id.toString().slice(0, 8), 16) * 1000
                                        ),
                                        _idB = new Date(
                                            parseInt(b._id.toString().slice(0, 8), 16) * 1000
                                        );
                                    if (_idA < _idB) return 1;
                                    if (_idA > _idB) return -1;
                                    return 0;
                                })
                                .slice(endCount - noOfElements, endCount),
                        });
                    }
                }
            );
        } else {
            commodities = await Commodity.find(
                {
                    user: { $nin: [currentUser] },
                    [searchCategory]: { $regex: searchQuery, $options: 'i' },
                },
                (err, docs) => {
                    console.log('Request Success', docs);
                    if (err) {
                        res.status(500).json({
                            success: false,
                            reason: 'Server error',
                        });
                    } else {
                        return res.status(201).json({
                            success: true,
                            reason: 'Commodity created Successfully',
                            count: docs.length,
                            commodityData: docs
                                .sort((a, b) => {
                                    let _idA = new Date(
                                            parseInt(a._id.toString().slice(0, 8), 16) * 1000
                                        ),
                                        _idB = new Date(
                                            parseInt(b._id.toString().slice(0, 8), 16) * 1000
                                        );
                                    if (_idA < _idB) return 1;
                                    if (_idA > _idB) return -1;
                                    return 0;
                                })
                                .slice(endCount - noOfElements, endCount),
                        });
                    }
                }
            );
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};
