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
                <div class="ml-1 mb-1" v-for="current_member in members" :key="current_member">
                    <span class ="badge badge-pill badge-success" v-if ="current_member.memberLatestChatStime == 0"> {{ current_member.memberName[0] }} </span>
                </div>
            </div>
            <p></p>
            <div id="scrollBox" class="scroll px-3 pb-5">
                <ul class="list-group list-group-flush list-unstyled">
                    <li class="mb-2"
                        v-for="(message, idx) in messages"
                        :key="(message, idx)"

                    >
                        <div v-if="user_id !== message.chatUserId">
                            <div class="mb-2" v-if="idx == 0">
                                {{ message.chatUserName }}
                            </div>
                            <div class="mb-2" v-else-if="messages[idx-1].chatUserId != message.chatUserId">
                                {{ message.chatUserName }}
                            </div>
                            <div v-else></div>


                            <div :class="{
                                'p-3 rounded-lg rounded float-left text-left border border-success':
                                message.chatStatus == 1,
                                'p-3 rounded-lg rounded float-left text-left border border-danger':
                                message.chatStatus == 0,
                                'p-3 rounded-lg rounded float-left text-left border border-secondary':
                                message.chatStatus == -1,
                                }"
                            >
                                <div @click="openCheck(idx, 1)">
                                    <span class="text-dark">
                                        {{ message.chatMsg }}<br>
                                    </span>
                                    <span v-show="showIdx1.indexOf(idx) >= 0" class="text-secondary">
                                        {{ message.chatCheck }}
                                    </span>
                                </div>

                            </div>
                            <div class="float-left ml-1 mt-4 pt-2" v-for="member in members" :key="member">
                                <span  :class ="{
                                    'badge badge-pill badge-primary':
                                    member.memberLatestChatStime % 5 == 0,
                                    'badge badge-pill badge-secondary':
                                    member.memberLatestChatStime % 5 == 1,
                                    'badge badge-pill badge-warning':
                                    member.memberLatestChatStime % 5 == 2,
                                    'badge badge-pill badge-info':
                                    member.memberLatestChatStime % 5 == 3,
                                    'badge badge-pill badge-dark':
                                    member.memberLatestChatStime % 5 == 4,
                                    }"
                                       v-if="member.memberLatestChatStime == message.chatStime ">
                                    {{member.memberName[0]}}
                                </span>
                                <span class="badge badge-pill badge-success"
                                      v-if="member.memberLatestChatStime == 0 && socket_messages.length == 0 && (idx+1) == messages.length"> <!--입퇴장 알람을 지우면 여기 값 1이 0으로!!-->
                                    {{member.memberName[0]}}
                                </span>
                            </div>
                        </div>
                        <div v-else>
                            <div  :class="{
                                'p-3 rounded-lg rounded float-right text-right bg-success':
                                message.chatStatus == 1,
                                'p-3 rounded-lg rounded float-right text-right bg-danger':
                                message.chatStatus == 0,
                                'p-3 rounded-lg rounded float-right text-right bg-secondary':
                                message.chatStatus == -1,
                                }"
                            >

                                <div @click="openCheck(idx, 1)">
                                <span class="text-dark">
                                    {{ message.chatMsg }}
                                </span><br>
                                    <span v-show="showIdx1.indexOf(idx) >= 0" class="text-secondary">
                                    {{ message.chatCheck }}
                                </span>
                                </div>
                            </div>

                            <div class="float-right mr-1 mt-4 pt-2" v-for="member in members" :key="member">
                                <span  :class ="{
                                        'badge badge-pill badge-primary':
                                        member.memberLatestChatStime % 5 == 0,
                                        'badge badge-pill badge-secondary':
                                        member.memberLatestChatStime % 5 == 1,
                                        'badge badge-pill badge-warning':
                                        member.memberLatestChatStime % 5 == 2,
                                        'badge badge-pill badge-info':
                                        member.memberLatestChatStime % 5 == 3,
                                        'badge badge-pill badge-dark':
                                        member.memberLatestChatStime % 5 == 4,
                                    }"
                                       v-if=" member.memberLatestChatStime == message.chatStime">
                                    {{member.memberName[0]}}
                                </span>
                                <span class="badge badge-pill badge-success"
                                      v-if="member.memberLatestChatStime == 0 && socket_messages.length == 0 && (idx+1) == messages.length "> <!--입퇴장 알람을 지우면 여기 값 1이 0으로!!-->
                                    {{member.memberName[0]}}
                                </span>
                            </div>
                        </div>
                    </li>


                    <li class="mb-2"
                        v-for="(socket_message, idx) in socket_messages"
                        :key="(socket_message, idx)">

                        <div v-if="socket_message.chatUserId != user_id">
                            <div v-if="idx == 0">
                                <div class="mb-2" v-if="messages.length == 0 || messages[messages.length - 1].chatUserId != socket_message.chatUserId">
                                    {{ socket_message.chatUserName }}
                                </div>
                                <div v-else></div>
                            </div>
                            <div v-else>
                                <div class="mb-2" v-if=" socket_messages[idx-1].chatUserId != socket_message.chatUserId">
                                    {{ socket_message.chatUserName }}
                                </div>
                                <div v-else></div>
                            </div>



                            <div :class="{
                                'p-3 rounded-lg rounded infoBox text-center bg-light':
                                socket_message.chatStatus == 3,
                                'p-3 rounded-lg rounded msgBox float-left text-left border border-success':
                                socket_message.chatStatus == 1,
                                'p-3 rounded-lg rounded msgBox float-left text-left border border-danger':
                                socket_message.chatStatus == 0,
                                'p-3 rounded-lg rounded msgBox float-left text-left border border-secondary':
                                socket_message.chatStatus == -1,
                                }"
                            >
                                <div @click="openCheck(idx,2)">
                                <span class="text-dark">
                                    {{ socket_message.chatMsg }}
                                </span>
                                <span v-show="showIdx2.indexOf(idx) >= 0" class="text-secondary">
                                    {{ socket_message.chatCheck }}
                                </span>
                                </div>
                            </div>

                            <div class="float-left ml-1 mt-4 pt-2" v-for="member in members" :key="member">
                                <span class="badge badge-pill badge-success"
                                      v-if="member.memberLatestChatStime == 0 && (idx+1) == socket_messages.length">
                                    {{member.memberName[0]}}
                                </span>
                                <span  :class ="{
                                    'badge badge-pill badge-primary':
                                    member.memberLatestChatStime % 5 == 0,
                                    'badge badge-pill badge-secondary':
                                    member.memberLatestChatStime % 5 == 1,
                                    'badge badge-pill badge-warning':
                                    member.memberLatestChatStime % 5 == 2,
                                    'badge badge-pill badge-info':
                                    member.memberLatestChatStime % 5 == 3,
                                    'badge badge-pill badge-dark':
                                    member.memberLatestChatStime % 5 == 4,
                                    }"
                                       v-if="member.memberLatestChatStime == socket_message.s_time">
                                        {{member.memberName[0]}}
                                    </span>
                            </div>
                        </div>
                        <div v-else>
                            <div :class="{
                                'p-3 rounded-lg rounded infoBox text-center bg-light':
                                socket_message.chatStatus == 3,
                                'p-3 rounded-lg rounded msgBox float-right text-right bg-success':
                                socket_message.chatStatus == 1,
                                'p-3 rounded-lg rounded msgBox float-right text-right bg-danger':
                                socket_message.chatStatus == 0,
                                'p-3 rounded-lg rounded msgBox float-right text-right bg-secondary':
                                socket_message.chatStatus == -1,
                                }"
                            >
                                <div @click="openCheck(idx,2)">
                                <span class="text-dark">
                                    {{ socket_message.chatMsg }}
                                </span><br>
                                <span v-show="showIdx2.indexOf(idx) >= 0" class="text-secondary">
                                    {{ socket_message.chatCheck }}
                                </span>
                                </div>

                            </div>
                            <div class="float-right mr-1 mt-4 pt-2" v-for="member in members" :key="member">
                                <span class ="badge badge-pill badge-success"
                                      v-if="member.memberLatestChatStime == 0 && (idx+1) == socket_messages.length">
                                    {{member.memberName[0]}}
                                </span>
                                <span :class ="{
                                    'badge badge-pill badge-primary':
                                     member.memberLatestChatStime % 5 == 0,
                                     'badge badge-pill badge-secondary':
                                     member.memberLatestChatStime % 5 == 1,
                                     'badge badge-pill badge-warning':
                                     member.memberLatestChatStime % 5 == 2,
                                     'badge badge-pill badge-info':
                                     member.memberLatestChatStime % 5 == 3,
                                     'badge badge-pill badge-dark':
                                     member.memberLatestChatStime % 5 == 4,
                                    }"
                                      v-if="member.memberLatestChatStime == socket_message.s_time">
                                        {{member.memberName[0]}}
                                </span>
                            </div>
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
    import axios from "axios";

    export default {
        name: "Room",
        created: function () {

            if (typeof this.$route.params.room_number == "undefined" || this.$route.params.room_number == null) {
                console.log('NOT FOUND room');
                axios.post('/api/room', {
                    'userIds': this.$route.params.user_id
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
                        this.$store.commit('updateFriends', this.$store.commit('updateRoom'));
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
                newMessage: "",
                //test: "",
                members: [], //방의 멤버 정보
                current_members: [], //redis를 통해 현재 접속되어 있는 유저들의 정보를 갱신하는 리스트 //입, 퇴장 이벤트 시에만 변경
                socket_messages: [],
                socket_chat: "",
                showIdx1: [],
                showIdx2: [],
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
                    if (data.user != this.user_id) {
                        let idx = this.members.findIndex(item => {
                            return (item.memberId == data.user)
                        })
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
                        this.members[idx].memberLatestChatStime = this.messages[this.messages.length - 1].chatStime;
                    }

                    console.log("퇴장 알람 후 방의 멤버", this.members);


                });
                this.socket_chat.on('checked msg', (data) => {
                    this.socket_messages.forEach((socket_message) => {
                        if (socket_message.chatStatus === -1 && socket_message.s_time === data.s_time) {
                            socket_message.chatStatus = data.chatStatus;
                            if(socket_message.chatMsg != data.chatCheck){
                                socket_message.chatCheck = data.chatCheck;
                            }
                        }
                    })

                });
            },
            initRoom: function () {
                let roomIdx = this.$store.state.rooms.findIndex(x => x.id === this.$route.params.room_number);
                if (roomIdx !== -1) {
                    this.$store.state.countChat -= this.$store.state.rooms[roomIdx].unread;
                    this.$store.state.rooms[roomIdx].unread = 0;
                }
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
                            let idx = this.members.findIndex(item => {
                                return (item.memberId == current_member)
                            });
                            this.members[idx].memberLatestChatStime = 0;
                        });
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
                let temp = new Date().getTime() % 1000000 + this.$store.state.user.id * 1000000;
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
            openCheck: function (idx, num) {
                if(num == 1){
                    if(this.showIdx1.indexOf(idx) >= 0 ){
                        this.showIdx1.splice(this.showIdx1.indexOf(idx),1);
                    }else{
                        this.showIdx1.push(idx);
                    }
                }else if (num ==2){
                    if(this.showIdx2.indexOf(idx) >= 0 ){
                        this.showIdx2.splice(this.showIdx2.indexOf(idx),1);
                    }else{
                        this.showIdx2.push(idx);
                    }
                }
            },
            quitRoom: function () {
                this.$http.get(`/api/room/out/${this.user_id}/${this.room_id}`).then(response => {
                    if (response.status == 200) {
                        if (this.room_id === this.$store.state.user.myroom) this.$store.state.user.myroom = null;

                        this.$router.go(-1);
                        this.$toasted.show("방에서 나갔습니다", {
                            theme: "toasted-primary",
                            icon: 'faCheck',
                            type: 'success',
                            position: "top-right",
                            duration: 3000
                        });
                    } else {
                        console.log("Fail to get out the room");
                    }
                })
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
            this.$store.commit('updateRoom');
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

    .margin-left {
        margin-left: 5px;
    }

    .margin-bottom {
        margin-bottom: 5px;
    }

</style>
