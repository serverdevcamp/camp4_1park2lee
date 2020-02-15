<template>

    <div class="container">
        <div class="container pt-5 pb-2" style="height: 700px;">
            <h1>채팅방 목록</h1>
            <div id="scrollBox" class="scroll pr-3 pl-3 pb-5">
            <ul class="rooms list-group">

                <router-link :to='{ name: "Room", params: {user_id: user_id, room_number:room.id}}' tag="li"
                             v-for="room in rooms" :key="room.id"
                             class="list-group-item justify-content-between align-items-center list-group-item-action rounded">
                    <div class="row">
                        <div class="col-md-6">
                            {{room.name}}
                        </div>
                        <div class="col-md-5">
                            <div v-if="room.member.length > 1">
                            {{room.member[0]+' 외 '+(room.member.length-1).toString()+'명'}}
                            </div>
                        </div>
                        <div class="col-md-1 my-auto" v-if="room.unread > 0">
                            <span class="badge badge-danger badge-pill float-right">{{ room.unread }}</span>
                        </div>
                    </div>
                </router-link>
            </ul>
            </div>
            <div class="row fixed-bottom pb-4">
                <div class="col-10"></div>
                <div class="col-1">

                    <div>
                        <button type="button" class="btn btn-primary btn-lg rounded-circle shadow-lg" @click="getFriends" >+</button>
                        <b-modal id="newRoomModal" hide-footer>
                            <template v-slot:modal-title>
                                새 채팅방 만들기
                            </template>
                            <div class="d-block text-center">
                                <ul class="list-group mx-3">
                                    <li class="list-group-item justify-content-between" v-for="friend in friends" :key="friend">
                                        <div class="row">
                                            <div class="col-2">profile</div>
                                            <div class="col-8 text-left">{{friend.name}} ( {{friend.grade}} )</div>
                                            <div class=" col-1 ml-2 custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" :value="friend.id" :id="friend.id" v-model="checkedUsers">
                                                <label class="custom-control-label" v-bind:for="friend.id"></label>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <b-button class="mt-3" block @click="makeRoom">생성!</b-button>
                        </b-modal>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    // import io from "socket.io-client";

    import axios from "axios";

    export default {
        name: 'RoomList',
        created: function () {
            this.$store.commit('updateRoom');
            // this.updateList();
        },
        data: function () {
            return {
                friends: [],
                rooms: this.$store.state.rooms,
                checkedUsers: [this.$store.state.user.id,],
                user_id: this.$store.state.user.id
                // socket_chat: io( //소켓에 namespace 지정
                //     `localhost:3000/chat?room=${this.$route.params.room_number}&user=${this.$route.params.user_id}`
                // )
            }
        },
        components: {},
        methods: {
            makeRoom: function(){

                let object = {
                    'userIds': this.checkedUsers
                };
                axios.post('/api/room', object)
                    .then((res) => {
                        if (res)
                        this.$toasted.show("생성 완료!", {
                            theme: "toasted-primary",
                            icon : 'faCheck',
                            type : 'success',
                            position: "top-right",
                            duration : 3000
                        });
                        // this.updateList();
                        this.$store.commit('updateRoom');
                    }).catch((err) => {
                    this.$toasted.show("생성 실패!", {
                        theme: "toasted-primary",
                        type : 'error',
                        position: "top-right",
                        duration : 3000
                    });
                    console.log(err);
                });
                this.$bvModal.hide('newRoomModal');
            },
            getFriends: function () {
                this.$bvModal.show('newRoomModal');
                axios.get('/auth/friend')
                    .then((res) => {
                        this.friends = res.data
                    }).catch((err) => {
                    console.log(err);
                });

            }

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
