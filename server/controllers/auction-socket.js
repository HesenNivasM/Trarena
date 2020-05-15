const AuctionRoom = require('./../models/AuctionRoom');

exports.joinAuctionRoom = async (data) => {
    const doc = await AuctionRoom.findOne({ roomId: data.auctionRoom.roomId });
    const returnValue = doc;
    // If the user is already present in the room do not push his user identity again
    let userPresent = false;
    await doc.members.forEach((member) => {
        if (member._id === data.user._id) {
            userPresent = true;
        }
    });
    if (!userPresent) {
        doc.members.push(data.user);
    }
    await doc.save();
    return returnValue;
};

exports.exitAuctionRoom = async (data) => {
    console.log('exitAuction called');
    const doc = await AuctionRoom.findOne({ roomId: data.auctionRoom.roomId });
    const returnValue = doc;
    // If the user is already present in the room do not push his user identity again
    let userPresent;
    await doc.members.forEach((member, i) => {
        if (member._id === data.user._id) {
            userPresent = i;
        }
    });
    await doc.members.splice(userPresent, 1);
    await doc.save();
    return returnValue;
};

exports.messageReceived = async (data) => {
    console.log('message received', data);
    const doc = await AuctionRoom.findOne({ roomId: data.auctionRoom.roomId });
    await doc.messages.push({
        user: data.user,
        message: data.message,
        date: new Date(),
    });
    const returnValue = await doc;
    await doc.save();
    return returnValue;
};
