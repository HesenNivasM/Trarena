const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
// For socket io pa
const {
    joinAuctionRoom,
    exitAuctionRoom,
    messageReceived,
} = require('./controllers/auction-socket');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:4200/', credentials: true }));
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public/images')));

app.use('/api/users/', require('./routes/users'));
app.use('/api/commodity/', require('./routes/commodity'));
app.use('/api/cart/', require('./routes/cart'));
app.use('/api/auction/', require('./routes/auction'));

const server = http.createServer(app);
const io = socketio.listen(server, {
    transports: ['websocket', 'xhr-polling'],
});

io.on('connection', (socket) => {
    socket.on('connection', (data) => {
        console.log('connected');
    });
    // when a user joins an auction room
    socket.on('joinAuctionRoom', async (data) => {
        const auctionRoom = await joinAuctionRoom(data);
        socket.join(data.auctionRoom.roomId);
        io.in(data.auctionRoom.roomId).emit('auctionRoomUpdate', { auctionRoom: auctionRoom });
    });
    socket.on('exitAuction', async (data) => {
        const auctionRoom = await exitAuctionRoom(data);
        console.log('exitAuction', auctionRoom);
        io.in(data.auctionRoom.roomId).emit('auctionRoomUpdate', { auctionRoom: auctionRoom });
    });
    socket.on('message', async (data) => {
        const auctionRoom = await messageReceived(data);
        console.log('message', auctionRoom.messages);
        io.in(data.auctionRoom.roomId).emit('auctionRoomUpdate', { auctionRoom: auctionRoom });
    });
    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});

const PORT = process.env.PORT || 9999;

server.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
