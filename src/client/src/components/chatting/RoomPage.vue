<template>

<div>
  <h2>{{username}}</h2>
  <div class="card">
  <!-- <p>socket:{{socket}}||{{data}}{{messages}}</p> -->
  {{messages}}
  <p></p>
  <li class="list-group-item" v-for="message in messages" :key="message">
      <span :class="{'float-left':message.type === 1}">
          {{message.message}}
          <small>:{{message.user}}</small>
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
  // created: function(){
  //   let user_id = this.$route.params.user_id;
  //   let room_number = this.$route.params.room_number;
  //   this.$http.get(`/api/room/${user_id}/${room_number}`)
  //   .then((response)=>{
  //       this.user_id = response.data.userId;
  //       this.user_name = response.data.userName;
  //   })
    
  // },
  data: function(){
    let user_id = this.$route.params.user_id;
    let room_number = this.$route.params.room_number;
    return {
      user_id: '',
      user_name: '',
      messages: [],
      data:'',
      // socket: io('http://127.0.0.1:3000')
      socket: io(`http://127.0.0.1:3000?room=${room_number}&user=${user_id}`)
    }
  },
  methods: {
    send() {
      this.messages.push({
          message: this.newMessage,
          type: 0,
          user: 'Me',
      });
      this.socket.emit('chat message', {
          msg: this.newMessage     
      });
    }
  },
  mounted(){
    this.socket.emit('chat enter');
    // this.socket.on('server chat enter', function (data) {
    //   this.messages.push({
    //       message: `${data.user}님이 입장하셨습니다.`,
    //       type: 0,
    //       user: data.user
    //     });
    // });
    this.socket.on('server chat message', function (data) {
        this.messages.push({
          message: data.msg,
          type: 1,
          user: data.user
        });
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
