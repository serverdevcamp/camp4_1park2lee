<template>
  <div id="Room">
    <div class="card bg-light">
      <!-- <p>test: {{test}}</p> -->
      <!-- <p>socket:{{socket}}||{{data}}{{messages}}</p> -->
      <h2 class="pt-4">{{ user_name }}</h2>
      <p></p>
      <div id="scrollBox" class="scroll pr-3 pl-3 pb-5">
        <ul class="list-group list-group-flush">
          <li
            class="msgBox list-group-item mb-2 rounded-lg rounded"
            v-for="message in messages"
            :key="message"
            :class="{
              'float-right text-right bg-success':
                message.chatUserId == user_id && message.chatStatus == 1,
              'float-right text-right bg-danger':
                message.chatUserId == user_id && message.chatStatus == 0,
              'float-right text-right bg-secondary':
                message.chatUserId == user_id && message.chatStatus == -1,
              'float-left text-left border border-success': 
                message.chatUserId != user_id && message.chatStatus == 1,
              'float-left text-left border border-danger': 
                message.chatUserId != user_id && message.chatStatus == 0,
              'float-left text-left border border-secondary': 
                message.chatUserId != user_id && message.chatStatus == -1,

            }"
          >
            <div v-if="message.chatUserId != user_id">
              
              <small>{{ message.chatUserName }}</small><br>
              <span class="text-dark">
                ({{message.chatUnread}})
                {{ message.chatMsg }}
              </span><br>
              <span class="text-secondary">
                {{ message.chatCheck }}
              </span>
            </div>
            <div v-else>
              <span class="text-dark">
                ({{message.chatUnread}})
                {{ message.chatMsg }}
              </span><br>
              <span class="text-secondary">
                {{ message.chatCheck }}
              </span>
            </div>
            
          </li>

          <li
            class="list-group-item mb-2 rounded"
            v-for="socket_message in socket_messages"
            :key="socket_message"
            :class="{
              'infoBox text-center bg-light':
                socket_message.chatStatus == 3,
              'msgBox float-right text-right bg-success':
                socket_message.chatUserId == user_id && socket_message.chatStatus == 1,
              'msgBox float-right text-right bg-danger':
                socket_message.chatUserId == user_id && socket_message.chatStatus == 0,
              'msgBox float-right text-right bg-secondary':
                socket_message.chatUserId == user_id && socket_message.chatStatus == -1,
              'msgBox float-left text-left border border-success': 
                socket_message.chatUserId != user_id && socket_message.chatStatus == 1,
              'msgBox float-left text-left border border-danger': 
                socket_message.chatUserId != user_id && socket_message.chatStatus == 0,
              'msgBox float-left text-left border border-secondary': 
                socket_message.chatUserId != user_id && socket_message.chatStatus == -1,
            }"
          >
            <div v-if="socket_message.chatUserId != user_id">
              <small>{{ socket_message.chatUserName }}</small>
              <span class="text-dark">
                {{ socket_message.chatMsg }}
              </span>
            </div>
            <div v-else>
              <span class="text-dark">
                {{ socket_message.chatMsg }}
              </span>
            </div>
            
          </li>
        </ul>
      </div>
      <div class="card-body chat-input">
        <b-form @submit.prevent="send">
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              v-model="newMessage"
              placeholder="Enter message here"
              autocomplete="off"
              required
            />
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  el: ".Room",
  name: "Room",
  created: function() {
    let user_id = this.$route.params.user_id;
    let room_number = this.$route.params.room_number;
    this.$http.get(`/api/room/${user_id}/${room_number}`).then(response => {
      this.user_name = response.data.userName
      this.messages = response.data.chatList;
    });

    window.onbeforeunload = () => {
      this.socket.emit("disconnect", this.username);
    };

    this.socket.emit("chat enter");
  },
  data() {
    return {
      user_id: this.$route.params.user_id,
      user_name: "",
      messages: [],
      test: "",
      socket_messages: [],
      socket: io(
        `http://127.0.0.1:3000?room=${this.$route.params.room_number}&user=${this.$route.params.user_id}`
      )
    };
  },
  methods: {
    push_data: function(data){
      console.log("data::"+data)
      this.socket_messages.push(data);
    },
    send: function(event) {
      this.socket.emit("chat message", {
        msg: this.newMessage,
        user_name: this.user_name
      });
      this.newMessage = "";
      event.target.reset();
      this.scrollToEnd();
    },
    scrollToEnd: function() {
      const scrollBox = this.$el.querySelector("#scrollBox");
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }
  },
  mounted() {

    this.socket.on("server chat enter", (data) => {
      let msg = {
        chatMsg: "----- 입장입장! -----",
        chatUserName: data.user_name,
        chatUserId: data.user,
        chatStatus: 3,
      };
      this.push_data(msg);
    });
 
    this.socket.on('server chat message', (data) => {
        this.socket_messages.push({
          chatMsg: data.msg,
          chatUserName: data.user_name,
          chatUserId: data.user,
          chatStatus: -1
        });
    });

    this.socket.on('server disconnected', (data) =>{
      this.socket_messages.push({
          chatMsg: "---- 퇴장하였다! -----",
          chatUserName: data.user,
          chatUserId: data.user,
          chatStatus: 3
        });
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Room {
  height: 100%;
}

.card {
  height: 100%;
}
div.scroll {
  width: auto;
  height: 100%;
  overflow-x: hidden;
  overflow-x: auto;
  text-align: justify;
}

@media (max-width: 575.98px) {
  .msgBox {
    max-width: 300px !important;
  }
}
@media (min-width: 576px) and (max-width: 1200px) {
  .msgBox {
    max-width: 400px !important;
  }
}
@media (min-width: 1200px) {
  .msgBox {
    max-width: 500px !important;
  }
}

.infoBox{
  text-align: center !important;

}

.float-right {
  margin-left: auto;
}

.float-left {
  margin-right: auto;
}

</style>
