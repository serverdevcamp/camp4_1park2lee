let {user, room_members} = require('../models');

const path = require('path');
const config = require('../../hunmin-config');

//방에 접속된 유저를 실시간으로 가져오기 위한 redis
const redis = require('redis');
const redisConfig = require(path.join(config.CONFIG_PATH, "redis.json"))[config.NODE_ENV];

const current_member_id = redis.createClient(redisConfig);
const connected_cli = redis.createClient(redisConfig);
const connectTag = "connect:";

let pub = redis.createClient(redisConfig);
let sub = redis.createClient(redisConfig);
sub.subscribe('sub');
sub.on("subscribe", function (channel, count) {
    console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
});

module.exports = {
    publish: (msg) => {
        pub.publish('sub', msg);
    },
    startPubSub: async (server, sockets) => {
        let handleDb = require('./handleDb');

        sub.on("message", function (channel, data) {
            data = JSON.parse(data);
            console.log("Inside Redis_Sub: data from channel " + channel + ": " + (data.sendType));
            if (parseInt("sendToSelf".localeCompare(data.sendType)) === 0) {
                sockets.io.emit(data.content.method, data.data);

            } else if (parseInt("sendToAllConnectedClients".localeCompare(data.sendType)) === 0) {
                sockets.chat.emit(data.content.method, data.data);

            } else if (parseInt("sendToAllClientsInRoom".localeCompare(data.sendType)) === 0) {
                sockets.chat.in(data.content.room).emit(data.content.method, data.content);

                if (data.content.method === "server chat message") {
                    sockets.alarm.in(data.content.room).emit(data.content.method, data.content.room);
                } else if (data.content.method === "invite room") {
                    for (let member of data.content.members) {
                        connected_cli.get((connectTag + member), (err, value) => {
                            if (err) return;

                            let memberSocket = sockets.alarm.sockets[value];
                            if (typeof memberSocket != "undefined") sockets.alarm.sockets[value].join(data.content.id);

                        });
                    }
                }
            } else if (parseInt("sendToClient".localeCompare(data.sendType)) === 0) {
                connected_cli.get((connectTag + data.content.user), (err, value) => {
                    sockets.alarm.to(value).emit(data.content.method, data.content.user);
                });
            }
        });

        sockets.alarm.on('connection', async function (socket) {
            let redisKey = connectTag + socket.handshake.query.user;
            connected_cli.set(redisKey, socket.id, redis.print);

            let roomLists = await room_members.findAll({
                where: {user_id: socket.handshake.query.user}
            });

            for (let room of roomLists) socket.join(room.room_id);

            socket.on('reconnect', async function (socket) {

                connected_cli.multi().del(redisKey).set(redisKey, socket.id).exec_atomic();
            });

            socket.on('disconnect', async function (socket) {
                connected_cli.del(redisKey);
            });


            socket.onclose = async function (reason) {
                if (!this.connected) return this;
                this.leaveAll();
                this.nsp.remove(this);
                this.client.remove(this);
                this.connected = false;
                this.disconnected = true;
                delete this.nsp.connected[this.id];
                connected_cli.del(redisKey);
            };

        });

        sockets.friend.on('connection', async function (socket) {
            socket.on('client friend req', async function (content) {
                console.log("client friend on", content);
                console.log(content.user);
                let reply = JSON.stringify({
                    method: 'message',
                    sendType: 'sendToClient',
                    content: {
                        method: 'server friend req',
                        user: content.user
                    }
                });
                pub.publish('sub', reply);
            });

            socket.on('client friend req permit', async function (content) {
                console.log("client friend req permit on", content);
                console.log(content.user);
                let reply = JSON.stringify({
                    method: 'message',
                    sendType: 'sendToClient',
                    content: {
                        method: 'server friend req permit',
                        user: content.user
                    }
                });
                pub.publish('sub', reply);
            });

        });


        sockets.chat.on('connection', function (socket) {
            let member_id_list = [];

            connected_cli.get((connectTag + socket.handshake.query.user), (err, value) => {
                let memberSocket = sockets.alarm.sockets[value];
                if (typeof memberSocket != "undefined"){
                    console.log('alarm socket off: ',socket.handshake.query.room);
                    sockets.alarm.sockets[value].leave(socket.handshake.query.room);
                }
            });

            current_member_id.lrange(socket.handshake.query.room, 0, -1, async (err, arr) => {
                if (arr.indexOf(socket.handshake.query.user) < 0) {
                    current_member_id.rpush(socket.handshake.query.room, socket.handshake.query.user);

                    member_id_list = arr;
                    member_id_list.push(socket.handshake.query.user);
                }
            });

            socket.on('client chat enter', async function (content) {


                if (member_id_list.indexOf(socket.handshake.query.user) === -1) {
                    member_id_list.push(socket.handshake.query.user);
                }

                console.log("Got 'chat enter' from client");
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

                pub.publish('sub', reply);
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
                pub.publish('sub', reply)
            });

            // overridding, ref:node_modules/socket.io/lib/socket.js:416
            socket.onclose = async function (reason) {
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
                connected_cli.get((connectTag + socket.handshake.query.user), (err, value) => {

                    let memberSocket = sockets.alarm.sockets[value];
                    if (typeof memberSocket != "undefined"){
                        sockets.alarm.sockets[value].join(socket.handshake.query.room);
                    }
                });
                console.log("Got 'disconnect' from client , " + JSON.stringify(content));
                let reply = JSON.stringify({
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

                pub.publish('sub', reply);
                //sub.quit(); //**pubsub 연결 유지?여부 */
            });
        });

        server.listen(3000, function () {
            console.log('Socket IO server listening on port 3000');
        });
    }
};