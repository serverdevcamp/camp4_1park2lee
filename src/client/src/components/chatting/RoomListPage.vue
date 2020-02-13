<template>

    <div class="container">
        <div class="container pt-5 pb-2" style="height: 700px;">
            <ul class="rooms list-group">

                <router-link :to='{ name: "Room", params: {user_id: user_id, room_number:room.id} }' tag="li"
                             v-for="room in rooms" :key="room.id"
                             class="list-group-item justify-content-between align-items-center list-group-item-action rounded">
                    <div class="row">
                        <div class="col-md-6">
                            {{room.name}}
                        </div>
                        <div class="col-md-5">
                            {{room.member[0]+' 외 '+(room.member.length-1).toString()+'명'}}
                        </div>
                        <div class="col-md-1" v-if="room.unread > 0">
                            <span class="badge badge-danger badge-pill float-right">{{ room.unread }}</span>
                        </div>
                    </div>
                </router-link>

            </ul>
        </div>
    </div>

</template>

<script>

    // import io from "socket.io-client";

    export default {
        name: 'RoomList',
        created: function () {

            let user_id = this.$store.state.user.id;
            this.$http.get(`/api/room/${user_id}`)
                .then((response) => {
                    this.rooms = response.data;
                    this.user_id = user_id;
                })
        },
        data: function () {
            return {
                rooms: [],
                user_id: ""
                // socket_chat: io( //소켓에 namespace 지정
                //     `localhost:3000/chat?room=${this.$route.params.room_number}&user=${this.$route.params.user_id}`
                // )
            }
        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
