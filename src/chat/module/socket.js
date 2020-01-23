/**
 * Upgrade HTTP server to socket.io server
 */


module.exports = async (server, app) => {
    var io = require('socket.io')(server);

    // namespace /chat에 접속
    var chat = io.of('/chat').on('connection', function (socket) {

        var room = socket.handshake.query.room;
        var user = socket.handshake.query.user;

        //서버에서 해당 room 에 접속했을 때 
        socket.join(room);
        chat.to(room).emit('chat enter', {
            "name": user
        });

        //메세지를 클라이언트로부터 받을 때
        socket.on('chat message', function (data) {
            //console.log('message from client: ', data);
            var user = socket.user = data.user;
            var room = socket.room = data.room;
            var msg = socket.msg = data.msg;


            socket.join(room);
            chat.to(room).emit('chat message', {
                "name": user,
                "msg": msg
            });
        });

        socket.on('disconnect', function (data) {
            console.log("서버에서 나가자제발ㅜ")

            console.log(data);
            socket.join("room1");
            chat.to("room1").emit('disconnected', {
                "name": "someone"
            });
        });

    });

    server.listen(3000, function () {
        console.log('Socket IO server listening on port 3000');
    });
};
