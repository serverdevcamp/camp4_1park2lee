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
            class="msgBox list-group-item mb-2 rounded-lg border border-success rounded-pill"
            v-for="message in messages"
            :key="message"
            :class="{
              'float-right text-right bg-success':
                message.chatUserId == user_id,
              'float-left text-left bg-light': message.chatUserId != user_id
            }"
          >
            <div v-if="message.chatUserId != user_id">
              <small>{{ message.chatUserName }}</small>
              <span class="text-dark">
                {{ message.chatMsg }}
              </span>
            </div>
            <div v-else>
              <span class="text-dark">
                {{ message.chatMsg }}
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
      this.user_id = user_id;
      this.user_name = user_id;
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
      room_number: this.$route.params.room_number,
      // user_id: '',
      user_name: "",
      messages: [],
      test: "",
      api_messages: [],
      socket: io.connect(
        `http://127.0.0.1:3000?room=${this.room_number}&user=${this.user_id}`
      )
    };
  },
  methods: {
    push_data: function(data){
      console.log("data::"+data)
      this.messages.push(data);
    },
    send: function(event) {
      this.socket.emit("chat message", {
        msg: this.newMessage
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
        chatMsg: "입장입장!",
        chatUserName: data.user,
        chatUserId: data.user
      };
      this.push_data(msg);
    });
 
    this.socket.on('server chat message', (data) => {
        this.messages.push({
          chatMsg: data.msg,
          chatUserName: data.user,
          chatUserId: data.user
        });
    });

    this.socket.on('server disconnected', (data) =>{
      this.messages.push({
          chatMsg: "퇴장하였다!",
          chatUserName: data.user,
          chatUserId: data.user
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

.float-right {
  margin-left: auto;
}

.float-left {
  margin-right: auto;
}
</style>
