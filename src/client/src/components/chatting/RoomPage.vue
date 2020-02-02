<template>

<div>
  <h2>{{user_name}}</h2>
  <div class="card">'
  <p>test: {{test}}</p>
  <p>message : {{messages}}</p>
  <!-- <p>socket:{{socket}}||{{data}}{{messages}}</p> -->
  <p></p>
  <li class="list-group-item" v-for="message in messages" :key="message">
      <span >
        {{message.chatMsg}}
        <small>:{{message.chatUserName}}</small>
      </span>
  </li>
  </div>
  <form @submit.prevent="send">
      <div class="form-group">
          <input type="text" class="form-control" v-model="newMessage"
              placeholder="Enter message here">
      </div>
  </form>
</div>


</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'Room',
  created: function(){
    let user_id = this.$route.params.user_id;
    let room_number = this.$route.params.room_number;
    this.$http.get(`/api/room/${user_id}/${room_number}`)
    .then((response)=>{
        this.user_id = user_id;
        this.user_name = user_id;
        this.messages = response.data.chatList;
    })
  },

  data: function(){
    let user_id = this.$route.params.user_id;
    let room_number = this.$route.params.room_number;
    return {
      user_id: '',
      user_name: '',
      messages: [],
      test: '',
      api_messages:[],
      // socket: io('http://127.0.0.1:3000')
      socket: io(`http://127.0.0.1:3000?room=${room_number}&user=${user_id}`)
      //socket: io(`http://127.0.0.1:3000?user=${user_id}`)
    }
  },
  methods: {
    send() {
      this.messages.push({
          chatUserName: this.user_name,
          chatUserId: this.user_id,
          chatMsg: this.newMessage,
      });
      this.socket.emit('chat message', {
          msg: this.newMessage     
      });
    }
  },
  mounted(){
    this.socket.emit('chat enter');

    this.socket.on('test', function (data) {
      this.test = data        
    });

    this.socket.on('server chat enter', function (data) {
      this.data = data;
      this.messages.push({
          chatMsg: `${data.user}님이 입장하셨습니다.`,
          chatUserName: data.user,
          chatUserId: data.user
        });
    });

    this.socket.on('server chat message', function (data) {
        this.messages.push({
          chatMsg: `${data.user}님이 입장하셨습니다.`,
          chatUserName: data.user,
          chatUserId: data.user
        });
    });

    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
