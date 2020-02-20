// import Vue from 'vue';
// import io from 'socket.io-client';
// import client_config from "./../src/config"
//
// const socket = io(client_config.CHAT_URL);
//
//
// const SocketPlugin = {
//     intall(vue){
//         vue.mixin({
//
//         });
//         vue.prototype.$sendMessage = ($payload) => {
//             socket.emit('chat', {
//                 msg: $payload.msg,
//                 name: $payload.name,
//             })
//         };
//         vue.prototype.$socket = socket;
//     },
// };
//
// Vue.use(SocketPlugin);