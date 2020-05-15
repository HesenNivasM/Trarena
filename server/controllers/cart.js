const Commodity = require('./../models/Commodity');

exports.getInterestedCommodities = async (req, res, next) => {
    try {
        const currentUser = await req.body.userData;

        const commodities = await Commodity.find({ user: { $nin: [currentUser] } }, (err, docs) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    reason: 'Server error',
                });
            } else {
                let finalizedDocs = [];
                // Get the docs in which the particular user is interested
                docs.forEach((doc, index) => {
                    doc.interestedUsers.forEach((element, value) => {
                        if (element._id === currentUser._id) {
                            finalizedDocs.push(doc);
                        }
                    });
                });

                return res.status(201).json({
                    success: true,
                    reason: 'Commodity created Successfully',
                    count: finalizedDocs.length,
                    commodityData: finalizedDocs.sort((a, b) => {
                        let _idA = new Date(parseInt(a._id.toString().slice(0, 8), 16) * 1000),
                            _idB = new Date(parseInt(b._id.toString().slice(0, 8), 16) * 1000);
                        if (_idA < _idB) return 1;
                        if (_idA > _idB) return -1;
                        return 0;
                    }),
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};

exports.getOwnCommodities = async (req, res, next) => {
    try {
        const currentUser = await req.body.userData;

        const commodities = await Commodity.find({ user: currentUser }, (err, docs) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    reason: 'Server error',
                });
            } else {
                let finalizedDocs = docs;

                return res.status(201).json({
                    success: true,
                    reason: 'Commodity created Successfully',
                    count: finalizedDocs.length,
                    commodityData: finalizedDocs.sort((a, b) => {
                        let _idA = new Date(parseInt(a._id.toString().slice(0, 8), 16) * 1000),
                            _idB = new Date(parseInt(b._id.toString().slice(0, 8), 16) * 1000);
                        if (_idA < _idB) return 1;
                        if (_idA > _idB) return -1;
                        return 0;
                    }),
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};
