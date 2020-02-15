let { user } = require('../models');

//방에 접속된 유저를 실시간으로 가져오기 위한 redis
const redis = require('redis');
const redisConfig = require('../config/redis');
const current_member_id = redis.createClient(redisConfig);

// var io = require('../bin/www').io;
// var chat = require('../bin/www').chat;

let pub = redis.createClient(redisConfig);
let sub = redis.createClient(redisConfig);

sub.subscribe('sub');
sub.on("subscribe", function(channel, count) {
    console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
});

module.exports = {
    publish: (msg) => {
        pub.publish('sub',msg);
    },
    startPubSub: async (server,io,chat,room) => {
        let handleDb = require('./handleDb');
        //upgrade HTTP server to socket.io server
        // let io = require('socket.io')(server);
        sub.on("message", function (channel, data) {
            data = JSON.parse(data);
            console.log("Inside Redis_Sub: data from channel " + channel + ": " + (data.sendType));
            if (parseInt("sendToSelf".localeCompare(data.sendType)) === 0) {
                io.emit(data.content.method, data.data);
            } else if (parseInt("sendToAllConnectedClients".localeCompare(data.sendType)) === 0) {
                chat.emit(data.content.method, data.data);
                //io.sockets.emit(data.content.method, data.data);
            } else if (parseInt("sendToAllClientsInRoom".localeCompare(data.sendType)) === 0) {
                chat.in(data.content.room).emit(data.content.method, data.content);
                //io.sockets.to(data.content.room).emit(data.content.method, data.content);
            }
        });

        //namespace '/chat'에 접속'
        // const chat = io.of('/chat');
        chat.on('connection', function (socket) {
            //io.on('connection', function (socket) {

        let member_id_list = [];

        current_member_id.lrange(socket.handshake.query.room, 0, -1, async(err, arr) => {
            if(arr.indexOf(socket.handshake.query.user) < 0){
                current_member_id.rpush(socket.handshake.query.room, socket.handshake.query.user);

                member_id_list = arr;
                member_id_list.push(socket.handshake.query.user);
            }
        })

            socket.on('client chat enter', async function (content) {

            if(member_id_list.indexOf(socket.handshake.query.user) === -1){
                member_id_list.push(socket.handshake.query.user);
            }

                console.log("Got 'chat enter' from client" );
                socket.join(socket.handshake.query.room);
                let reply = JSON.stringify({
                    method: 'message',
                    sendType: 'sendToAllClientsInRoom',
                    content: {
                        method: 'server chat enter',
                        user: socket.handshake.query.user,
                        room: socket.handshake.query.room,
                        current_member_list: member_id_list
                    }
                });

                pub.publish('sub',reply);
            });

            socket.on('client chat message', function (content) {
                console.log("Got 'chat message' from client , " + JSON.stringify(content));
                socket.join(socket.handshake.query.room);
                let reply = JSON.stringify({
                    method: 'message',
                    sendType: 'sendToAllClientsInRoom',
                    content: {
                        method: 'server chat message',
                        user: socket.handshake.query.user,
                        room: socket.handshake.query.room,
                        user_name: content.user_name,
                        msg: content.msg,
                        s_time: content.s_time

                    }
                });
                handleDb.saveChat(JSON.parse(reply).content);
                pub.publish('sub',reply)
            });

            // overridding, ref:node_modules/socket.io/lib/socket.js:416
            socket.onclose = async function (reason) {
                console.log("들어오는지?")
                if (!this.connected) return this;
                //debug('closing socket - reason %s', reason);
                this.leaveAll();
                this.nsp.remove(this);
                this.client.remove(this);
                this.connected = false;
                this.disconnected = true;
                delete this.nsp.connected[this.id];

                current_member_id.lrem(this.handshake.query.room, 0, this.handshake.query.user);
                handleDb.updateLatestChat(this.handshake.query.user, this.handshake.query.room);

                //this.emit('disconnect', reason);
                this.emit('disconnect', {
                    "reason": reason,
                    "user": this.handshake.query.user,
                    "room": this.handshake.query.room
                });
            };


        socket.on('disconnect', function (content) {
            console.log("Got 'disconnect' from client , " + JSON.stringify(content));
            //socket.leave(content.room);
            var reply = JSON.stringify({
                method: 'message',
                sendType: 'sendToAllClientsInRoom',
                content: {
                    method: 'server disconnected',
                    user: socket.handshake.query.user,
                    room: socket.handshake.query.room,
                    //user_name: content.user_name,
                }
            });
            let idx = member_id_list.indexOf(socket.handshake.query.user);
            member_id_list.splice(idx, 1);

            pub.publish('sub',reply);
            //sub.quit(); //**pubsub 연결 유지?여부 */
        });
    });

        server.listen(3000, function () {
            console.log('Socket IO server listening on port 3000');
        });
    }
};