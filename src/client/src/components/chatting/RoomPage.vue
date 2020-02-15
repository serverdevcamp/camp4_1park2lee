<template>
    <div id="Room">
        <div class="card bg-light mt-3">
            <!-- <p>test: {{test}}</p> -->
            <!-- <p>socket:{{socket}}||{{data}}{{messages}}</p> -->
            <div class="row mx-md-3 shadow-sm">
                <div class="col-md-2"></div>
                <h2 class="pt-4 col-md-8">{{ room_name }}</h2>
                <div class="col-md-2 my-auto">
                    <b-dropdown id="dropdown-1" text="메뉴" right variant="outline-dark">
                        <b-dropdown-item @click="this.inviteUser">초대하기</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item @click="this.quitRoom">채팅방 나가기</b-dropdown-item>
                    </b-dropdown>
                </div>
            </div>
            <p></p>
            <div id="scrollBox" class="scroll px-3 pb-5">
                <ul class="list-group list-group-flush">
                    <li
                            class="msgBox list-group-item mb-2 rounded-lg rounded"
                            v-for="(message, idx) in messages"
                            :key="(message, idx)"
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
                {{ message.chatMsg }}
              </span><br>
                            <span class="text-secondary">
                {{ message.chatCheck }}
              </span>
              <div v-for="member in members"
                 :key="member">
                <span v-if="member.memberLatestChatStime == message.chatStime ">
                  {{member.memberName}}
                </span>
                <span v-if="member.memberLatestChatStime == 0 && socket_messages.length == 0 && (idx+1) == messages.length"> <!--입퇴장 알람을 지우면 여기 값 1이 0으로!!-->
                  {{member.memberName}}
                </span>
              </div>
            </div>
            <div v-else>
              <span class="text-dark">
                {{ message.chatMsg }}
              </span><br>
              <span class="text-secondary">
                {{ message.chatCheck }}
              </span>
              <div v-for="member in members"
                   :key="member">
                <span v-if=" member.memberLatestChatStime == message.chatStime">
                  {{member.memberName}}
                </span>
                <span v-if="member.memberLatestChatStime == 0 && socket_messages.length == 0 && (idx+1) == messages.length "> <!--입퇴장 알람을 지우면 여기 값 1이 0으로!!-->
                  {{member.memberName}}
                </span>
              </div>
            </div>

            
          </li>


          <li
            class="list-group-item mb-2 rounded"
            v-for="(socket_message, idx) in socket_messages"
            :key="(socket_message, idx)"
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
              <div v-for="member in members"
                   :key="member">
                <span v-if="member.memberLatestChatStime == 0 && (idx+1) == socket_messages.length">
                  {{member.memberName}}
                </span>
                <span v-if="member.memberLatestChatStime == socket_message.s_time">
                  {{member.memberName}}
                </span>
              </div>
            </div>
            <div v-else>
              <span class="text-dark">
                {{ socket_message.chatMsg }}
              </span>
              <div v-for="member in members"
                   :key="member">
                <span v-if="member.memberLatestChatStime == 0 && (idx+1) == socket_messages.length">
                  {{member.memberName}}
                </span>
                <span v-if="member.memberLatestChatStime == socket_message.s_time">
                  {{member.memberName}}
                </span>
              </div>
            </div>

          </li>
        </ul>
      </div>
      <!--<span class="float-left" style="float: left;" v-for="current_member in current_members" :key="current_member">
        {{current_member}}
      </span>-->
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
    import axios from "axios";

    export default {
        el: ".Room",
        name: "Room",
        created: function () {

            if (typeof this.$route.params.room_number == "undefined" || this.$route.params.room_number == null) {
                axios.post('/api/room', {
                    'userIds' : [this.user_id]
                })
                    .then((res) => {
                        if (res)
                            this.$toasted.show("생성 완료!", {
                                theme: "toasted-primary",
                                icon: 'faCheck',
                                type: 'success',
                                position: "top-right",
                                duration: 3000
                            });
                        this.room_id = res.data.id;
                        this.$store.state.user.myroom = this.room_id;
                        this.initRoom();
                        this.socketOn();
                    }).catch((err) => {
                    this.$toasted.show("생성 실패!", {
                        theme: "toasted-primary",
                        type: 'error',
                        position: "top-right",
                        duration: 3000
                    });
                    console.log(err);
                });
            } else this.initRoom();

        },
        data() {
            return {
                user_id: this.$store.state.user.id,
                user_name: "",
                room_id: this.$route.params.room_number,
                room_name: "",
                messages: [],
                //test: "",
                members: [], //방의 멤버 정보
                current_members: [], //redis를 통해 현재 접속되어 있는 유저들의 정보를 갱신하는 리스트 //입, 퇴장 이벤트 시에만 변경
                socket_messages: [],
                socket_chat: ""
            };
        },
        methods: {
            socketOn: function () {
                this.socket_chat.on("server chat enter", (data) => {
                    // let msg = {
                    //   chatMsg: "----- 입장입장! -----",
                    //   chatUserName: data.user_name,
                    //   chatUserId: data.user,
                    //   chatStatus: 3,
                    // };
                    //this.push_data(msg);

      this.current_members = data.current_member_list;
      //console.log("입장 알람 후 방의 현재 접속 멤버 ", this.current_members);

      //남이 접속할 때 변경해주는 부분
      if(data.user != this.user_id){
      let idx = this.members.findIndex(item => { return (item.memberId == data.user)})
      this.members[idx].memberLatestChatStime = 0;
      console.log("남이 입장 후 방의 멤버 ", this.members);
          console.log("현재멤버", this.current_members);
      }

                });

                this.socket_chat.on('server chat message', (data) => {
                    this.socket_messages.push({
                        chatMsg: data.msg,
                        chatUserName: data.user_name,
                        chatUserId: data.user,
                        chatId: data.chatId,
                        s_time: data.s_time,
                        chatStatus: -1
                    });
                    //console.log(data.user_name, ":", data.msg)
                });

                this.socket_chat.on('server disconnected', (data) => {
                    // this.socket_messages.push({
                    //     chatMsg: "---- 퇴장하였다! -----",
                    //     chatUserName: data.user_name,
                    //     chatUserId: data.user,
                    //     chatStatus: 3
                    //   });

                    let idx = this.current_members.indexOf(data.user);
                    this.current_members.splice(idx, 1);
                    //console.log("퇴장 알람 후 방의 현재 접속 멤버",this.current_members)


                    //latest_chat_stime 갱신 사항 적용
                    idx = this.members.findIndex(item => {
                        return (item.memberId == data.user)
                    })
                    if (this.socket_messages.length != 0) {
                        this.members[idx].memberLatestChatStime = this.socket_messages[this.socket_messages.length - 1].s_time;
                    } else {
                        this.members[idx].memberLatestChatStime = this.messages[this.messages.length - 1].s_time;
                    }

                    console.log("퇴장 알람 후 방의 멤버", this.members);


                });
                this.socket_chat.on('checked msg', (data) => {
                    this.socket_messages.forEach((socket_message) => {
                        if (socket_message.chatStatus === -1 && socket_message.s_time === data.s_time) {
                            socket_message.chatStatus = data.chatStatus;
                            socket_message.chatCheck = data.chatCheck;
                        }
                    })


                });
            },
            initRoom: function () {
                this.socket_chat = io( //소켓에 namespace 지정
                    `localhost:3000/chat?room=${this.room_id}&user=${this.user_id}`
                );
                this.$http.get(`/api/room/${this.user_id}/${this.room_id}`).then(response => {

                    this.user_name = response.data.userName;
                    this.room_name = response.data.roomName;
                    this.messages = response.data.chatList;
                    this.members = response.data.memberList;

                })
                    .then(() => {
                        this.current_members.forEach(current_member => {
                            let idx = this.members.findIndex(item => { return (item.memberId == current_member)})
                            this.members[idx].memberLatestChatStime = 0;
                        })
                        console.log("내가 입장 후 방의 멤버", this.members)
                    });
                window.onbeforeunload = () => {
                    this.socket_chat.emit("disconnect", {user_name: this.user_name}); //기본 내장 함수 disconnect
                };

                this.socket_chat.emit("client chat enter"); //user의 이름을 받는 것 보다, 먼저 socket connect 이벤트를 발생시킴
            },
            push_data: function (data) {
                //console.log("data::"+data)
                this.socket_messages.push(data);
            },
            send: function (event) {
                let temp = new Date().getTime() % 1000000;
                console.log(temp);
                this.socket_chat.emit("client chat message", {
                    msg: this.newMessage,
                    user_name: this.user_name,
                    s_time: temp
                });
                this.newMessage = "";
                event.target.reset();
                this.scrollToEnd();
            },
            scrollToEnd: function () {
                const scrollBox = this.$el.querySelector("#scrollBox");
                scrollBox.scrollTop = scrollBox.scrollHeight;
            },
            quitRoom: function () {
                console.log('quit!');
            },
            inviteUser: function () {
                console.log('invite!');

            }
        },
        mounted() {
            if (typeof this.$route.params.room_number != "undefined" && this.$route.params.room_number != null) {
                this.socketOn();
            }
        },
        beforeDestroy() {
            this.socket_chat.close();
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

    .infoBox {
        text-align: center !important;

    }

    .float-right {
        margin-left: auto;
    }

    .float-left {
        margin-right: auto;
    }


</style>
