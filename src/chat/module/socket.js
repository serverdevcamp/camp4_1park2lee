/**
 * Upgrade HTTP server to socket.io server
 */


module.exports = async ( server, app ) => {
    var io = require('socket.io')(server);
    
    // namespace /chat에 접속
    var chat = io.of('/chat').on('connection', function(socket) {
        
        var room = socket.handshake.query.room;
        var user = socket.handshake.query.user;
        
        //서버에서 해당 room 에 접속했을 때 
        socket.join(room);
        chat.to(room).emit('chat enter', { "name" : user });

        //메세지를 클라이언트로부터 받을 때
        socket.on('chat message', function(data){
            //console.log('message from client: ', data);
            var user = socket.user = data.user;
            var room = socket.room = data.room;
            var msg = socket.msg = data.msg;

            
            socket.join(room);
            chat.to(room).emit('chat message', {"name" : user, "msg" : msg });
        });

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
            this.emit('disconnect', {"reason": reason, "user": this.handshake.query.user, "room": this.handshake.query.room });
        };


        socket.on('disconnect', function (data) {
            var room = data.room;
            var user = data.user;

            chat.to(room).emit('disconnected', { "name" : user });
        });

    });

    server.listen(3000, function() {
        console.log('Socket IO server listening on port 3000');
    });
};
