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
            <!--<div v-for="member in members"
                  :key="member">-->
              <div v-if="message.chatUserId != user_id">
                <small>{{ message.chatUserName }}</small><br>
                <span class="text-dark">
                  {{ message.chatMsg }}
                </span><br>
                <span class="text-secondary">
                  {{ message.chatCheck }}
                </span>
                <span>
                  <!--{{ 여기다 이름을?}} -->
                </span>
              </div>
              <div v-else>
                <span class="text-dark">
                  {{ message.chatMsg }}
                </span><br>
                <span class="text-secondary">
                  {{ message.chatCheck }}
                </span>
                <span>
                <!--{{ 여기다 이름을?}} -->
                </span>
              </div>
           <!-- </div>-->
            
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
              <span>
                <!--{{ 여기다 이름을?}} -->
              </span>
            </div>
            <div v-else>
              <span class="text-dark">
                {{ socket_message.chatMsg }}
              </span>
              <span>
                <!--{{ 여기다 이름을?}} -->
              </span>
            </div>
            
          </li>
        </ul>
      </div>
      <span class="float-name" style="float: left;" v-for="current_member in current_members" :key="current_member">
        {{current_member.name}}
      </span>
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

    this.$http.get(`/api/room/${this.user_id}/${this.room_id}`).then(response => {

      this.user_name = response.data.userName;
      this.room_name = response.data.roomName;
      this.messages = response.data.chatList;
      this.members = response.data.memberList;

      // this.members.forEach(member => {
      //   this.latest_chat_ids.push(member.memberLatestChatId)
      // });
    });

    window.onbeforeunload = () => {
      this.socket_chat.emit("disconnect", {user_name: this.user_name}); //기본 내장 함수 disconnect
    };

    this.socket_chat.emit("client chat enter"); //user의 이름을 받는 것 보다, socket connect 이벤트가 먼저 발생됨
  },
  data() {
    return {
      user_id: this.$route.params.user_id,
      user_name: "",
      room_id: this.$route.params.room_number,
      room_name: "",
      messages: [],
      //test: "",
      members: [], //방의 멤버 정보
      //latest_chat_ids:[], //방의 멤버 정보에 따른 Latest chat id
      current_members: [], //redis를 통해 현재 접속되어 있는 유저들의 정보를 갱신하는 리스트 //입, 퇴장 이벤트 시에만 변경
      socket_messages: [],
      socket_chat: io( //소켓에 namespace 지정
        `localhost:3000/chat?room=${this.$route.params.room_number}&user=${this.$route.params.user_id}`
      )
    };
  },
  methods: {
    push_data: function(data){
      //console.log("data::"+data)
      this.socket_messages.push(data);
    },
    send: function(event) {
      this.socket_chat.emit("client chat message", {
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


    this.socket_chat.on("server chat enter", (data) => {
      let msg = {
        chatMsg: "----- 입장입장! -----",
        chatUserName: data.user_name,
        chatUserId: data.user,
        chatStatus: 3,
      };
      this.push_data(msg);

      this.current_members = data.member_id_name_list;

      //내가 접속할 때 정보를 동기화
      if(data.user == this.user_id){
        this.current_members.forEach(current_member => {
          this.members.find(c => c.id === current_member.id).memberLatestChatId = 0;
        });
        //남이 접속할 때는 접속한 사람의 정보만 업로드
      }else{
        this.members.find(c => c.id === data.user).memberLatestChatId = 0
      }
      console.log("입장 알람 후 ", this.members);


    });
 
    this.socket_chat.on('server chat message', (data) => {
        this.socket_messages.push({
          chatMsg: data.msg,
          chatUserName: data.user_name,
          chatUserId: data.user,
          chatStatus: -1
        });
        //console.log(data.user_name, ":", data.msg)
    });

    this.socket_chat.on('server disconnected', (data) =>{
      this.socket_messages.push({
          chatMsg: "---- 퇴장하였다! -----",
          chatUserName: data.user_name,
          chatUserId: data.user,
          chatStatus: 3
        });

        let idx = this.current_members.indexOf([data.user, data.user_name]);
        this.current_members.splice(idx, 1);

        //latest_chat_id 갱신사항 적용
      this.members.find(c => c.id === data.user).memberLatestChatId = data.latest_chat_id;
        console.log("퇴장 알람 후 :", this.members);


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

.float-name{
  float: left;
  width: 80px;
}

</style>
