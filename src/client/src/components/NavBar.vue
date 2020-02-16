<template>

    <nav class="navbar navbar-light bg-dark">
        <div v-if="this.$store.state.loggedin === true">
            <router-link :to='{name: "Friend"}' class="navbar-brand text-light">훈민정음</router-link>
        </div>
        <div v-else>
            <router-link :to='{name: "Login"}' class="navbar-brand text-light">훈민정음</router-link>
        </div>
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active text-light">
            </li>
        </ul>
        <div v-if="isLogin">
        <span class="navbar-text mx-2" style="position: relative; z-index: 1;">
            <router-link :to='{name: "RoomList",params: {user_id: this.$store.state.user.id}}'><i
                    class="nav-icon text-light"><font-awesome-icon icon="comment"/></i>
                <span v-if="this.$store.state.countChat > 0" class="badge badge-danger badge-pill float-right mx-n3"
                      style="position: relative; z-index: 2; left: -7px">{{ this.$store.state.countChat }}</span>
            </router-link>
        </span>

        <span class="navbar-text mx-2" style="position: relative; z-index: 1;">
            <router-link :to='{name: "FriendRequests"}'><i class="nav-icon text-light"><font-awesome-icon icon="users"/></i>
                <span v-if="this.$store.state.countReq> 0" class="badge badge-danger badge-pill float-right mx-n3"
                      style="position: relative; z-index: 2; left: -7px">{{ this.$store.state.countReq }}</span>
            </router-link>
        </span>
            <span class="navbar-text ml-2">
            <router-link :to='{name: "AddFriend"}'><i class="nav-icon text-light"><font-awesome-icon icon="user-plus"/></i></router-link>
        </span>

        </div>
    </nav>
</template>

<script>
    import io from "socket.io-client";

    export default {
        name: 'nav-bar',
        data: function () {
            return {
                isLogin: false,
                socket: undefined,
                userId: null
            }
        },
        mounted() {
            this.$store.watch(this.$store.getters.getUserLogin, isLogin => {
                this.isLogin = isLogin;
                if (!isLogin) {
                    if (this.userId != null && typeof this.userId != "undefined") {
                        this.socket.emit("disconnect", {user_name: this.userId});
                        this.userId = null;
                    }

                } else {
                    this.userId = this.$store.state.user.id;
                    this.$store.commit('updateReq');
                    this.initSocket();
                }
            });
        },
        methods: {
            initSocket: function () {
                this.socket = io( //소켓에 namespace 지정
                    `localhost:3000/alarm?user=${this.$store.state.user.id}`
                );
                this.socket.on("server chat message", (data) => {
                    this.$store.state.countChat++;
                    console.log(this.$store.state.rooms, data);
                });

                console.log("initsocket", this.socket);

                this.socket.on("server friend req", (data) => {
                    this.$store.state.countReq++;
                    console.log("count Req:", data);
                });

            }
        }
    }
</script>

<style scoped>
    .navbar-branch {
        font-weight: bold !important;
    }

    .nav-icon {
        font-size: 20px;
    }
</style>
