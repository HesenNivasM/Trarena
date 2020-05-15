const User = require('./../models/User');

// // @desc  Get all stores
// // @route GET /api/v1/stores
// // @access Public
// exports.getStores = async (req, res, next) => {
//   try {
//     const stores = await Store.find();

//     return res.status(200).json({
//       success: true,
//       count: stores.length,
//       data: stores
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// @desc  Create a new User
// @route POST /api/users/create-user
// @access Public
exports.createUser = async (req, res, next) => {
    try {
        const receivedUser = await req.body;
        // Find whether the user exist already
        const findUser = await User.findOne({ email: receivedUser.email }, async (err, user) => {            
            if (err) {
                res.status(500).json({ success: false, reason: 'Server error' });
            } else if ( user && user.email === receivedUser.email ) {
                res.status(201).json({
                    success: false,
                    reason: 'User already exists. Try a different email'                    
                });
                console.log("Sent");
            } else {
                const user = await User.create(receivedUser);

                return res.status(201).json({
                    success: true,
                    reason: "User created Successfully"
                });
            }
        })
                
    } catch (err) {
        console.error(err);                
        res.status(500).json({ success: false, reason: 'Server error' });
    }
};

exports.loginUser = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const findUSer = await User.findOne({ email: email }, async (err, user) => {            
            if (err) {
                res.status(500).json({ success: false, reason: 'Server error' });
            } else if (user) {
                const userData = {                        
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    mobileNumber: user.mobileNumber,
                    jobType: user.jobType
                };

                if (user.password === password) {                    
                    const updateUser = await user.updateOne({ loggedIn : true }, async (err, user) => {
                        if (err) {
                            res.status(201).json({ success: false, reason: 'Server Error' });
                        } else {                            
                            res.status(201).json({
                                success: true,
                                reason: "User logged in successfully",
                                userData: userData
                            });
                        }
                    })
                } else {
                    res.status(201).json({
                        success: false,
                        reason: "Wrong password"
                    });
                }
            } else {
                res.status(201).json({
                    success: false,
                    reason: "Wrong email"
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(201).json({ success: false, reason: 'Server Error' });
    }
}

// @input:  userData
exports.logoutUser = async (req, res, next) => {
    const userData = req.body;
    try {
        const findUSer = await User.findOne({ _id: userData._id }, async (err, user) => {            
            if (err) {
                res.status(500).json({ success: false, reason: 'Server error' });
            } else if (user) {               
                const updateUser = await user.updateOne({ loggedIn : false }, async (err, user) => {
                    if (err) {
                        res.status(201).json({ success: false, reason: 'Server Error' });
                    } else {                            
                        res.status(201).json({
                            success: true,
                            reason: "User logged out successfully"
                        });
                    }
                });
            } else {
                res.status(201).json({ success: false, reason: 'Server Error' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(201).json({ success: false, reason: 'Server Error' });
    }
}