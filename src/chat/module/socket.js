/**
 * Upgrade HTTP server to socket.io server
 */


module.exports = async (server, app) => {
    
    var redis = require('redis');
    var io = require('socket.io')(server);

    var pub = redis.createClient();
    var sub = redis.createClient();

    sub.subscribe('sub');
    sub.on("subscribe", function(channel, count) {
        console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
    });

    sub.on("message", function (channel, data) { //""
        data = JSON.parse(data);
        console.log("Inside Redis_Sub: data from channel " + channel + ": " + (data.sendType));
        if (parseInt("sendToSelf".localeCompare(data.sendType)) === 0) {
            io.emit(data.content.method, data.data);
        } else if (parseInt("sendToAllConnectedClients".localeCompare(data.sendType)) === 0) {
            io.sockets.emit(data.content.method, data.data);
        } else if (parseInt("sendToAllClientsInRoom".localeCompare(data.sendType)) === 0) {
            io.sockets.to(data.content.room).emit(data.content.method, data.content);
        }

    });
    
    // namespace /chat에 접속
    //var chat = io.of('/chat').on('connection', function (socket) {
    io.on('connection', function (socket) {

        socket.on('chat enter', function (content) {
            console.log("Got 'chat enter' from client , " + JSON.stringify(content));
            socket.join(content.room);
            var reply = JSON.stringify({
                    method: 'message', 
                    sendType: 'sendToAllClientsInRoom',
                    content: {
                        method: 'server chat enter',
                        user: content.user,
                        room: content.room,
                        msg: `${content.user}님이 입장했습니다.`
                    }
                });
            pub.publish('sub',reply);
        });

        // var room = socket.handshake.query.room;
        // var user = socket.handshake.query.user;

        // //서버에서 해당 room 에 접속했을 때 
        // socket.join(room);
        // chat.to(room).emit('chat enter', {
        //     "name": user
        // });

        socket.on('chat message', function (content) {
            console.log("Got 'chat message' from client , " + JSON.stringify(content));
            var reply = JSON.stringify({
                    method: 'message', 
                    sendType: 'sendToAllClientsInRoom',
                    content: {
                        method: 'server chat message',
                        user: content.user,
                        room: content.room,
                        msg: content.user + " : " + content.msg 
                    }
                });
            pub.publish('sub',reply);

        });

        // //메세지를 클라이언트로부터 받을 때
        // socket.on('chat message', function (data) {
        //     //console.log('message from client: ', data);
        //     var user = socket.user = data.user;
        //     var room = socket.room = data.room;
        //     var msg = socket.msg = data.msg;


        //     socket.join(room);
        //     chat.to(room).emit('chat message', {
        //         "name": user,
        //         "msg": msg
        //     });
        // });

         // overridding, ref:node_modules/socket.io/lib/socket.js:416
        socket.onclose = function (reason) {
            if (!this.connected) return this;
            //debug('closing socket - reason %s', reason);
            this.leaveAll();
            this.nsp.remove(this);
            this.client.remove(this);
            this.connected = false;
            this.disconnected = true;
            delete this.nsp.connected[this.id];
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
                    user: content.user,
                    room: content.room,
                    msg: `${content.user}님이 퇴장했습니다.`
                }
            });
            pub.publish('sub',reply);
            //sub.quit(); //**pubsub 연결 유지?여부 */
        });

        // socket.on('disconnect', function (data) {
        //     var room = data.room;
        //     var user = data.user;

        //     chat.to(room).emit('disconnected', { "name" : user });
        // });

    });

    server.listen(3000, function () {
        console.log('Socket IO server listening on port 3000');
    });
};
