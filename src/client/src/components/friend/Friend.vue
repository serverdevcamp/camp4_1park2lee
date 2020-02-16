<template>

    <div class="index">

        <div class="mt-5 d-flex justify-content-between mb-2">
            <div></div>
            <div>
                <h1 class="h4">훈민정음</h1>
                <router-link :to='{ name: "RoomList" }' class="pt-2">내 대화방</router-link>
            </div>
            <div  class="pr-2">
                <button class="btn btn-primary btn-lg rounded-circle shadow-lg" @click="addFriend" ><i class="nav-icon"><font-awesome-icon icon="user-plus"/></i></button>
                <!--<router-link :to='{name: "AddFriend"}'><i class="nav-icon"><font-awesome-icon icon="user-plus"/></i></router-link>-->
            </div>
        </div>

        <div v-if="this.$store.state.loggedin === false">
            <div>
                <p class="text-dark">로그인을 먼저 해주세요! </p>
            </div>
            <router-link :to='{ name: "RoomList", params: {user_id: 1}}'>1번 유저의 대화방</router-link>
            <router-link :to='{ name: "RoomList", params: {user_id: 2}}'>2번 유저의 대화방</router-link>
            <router-link :to='{ name: "RoomList", params: {user_id: 3}}'>3번 유저의 대화방</router-link>


        </div>
        <div v-else>
            <ul class="list-group">
                <li class="list-group-item justify-content-between row" v-for="friend in friends" :key="friend">
                    <div class="row">
                        <div class="col-2">
                            <img :src="friend.image_path" class="rounded-circle" width="30px" height="30px">
                        </div>
                        <div class="col-3">
                            <div class="row">
                                <div class="text-left">{{friend.nickname}}</div>
                            </div>
                            <div class="row mb-4 my-auto">
                                <small>상태 메세지</small>
                            </div>
                        </div>
                        <div class="col-2">{{friend.grade}}</div>
                        <div v-if="friend.status === 0" class="col-3">혼자친구</div>
                        <div v-else class="col-2">같이친구</div>
                        <div class="col-1">
                            <div class="my-2 mr-1"><font-awesome-icon icon="comment" class="fa-2x"/></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!--<div>-->

                <div>
                    <add-friend/>
                </div>

        <!--</div>-->
    </div>
</template>

<script>
    import axios from "axios"
    import AddFriend from "./AddFriend";

    export default {
        name: 'Index',
        components: {
            'add-friend' : AddFriend
        },
        created() {
        },
        data() {
            return {
                friends: [],
            }
        },
        mounted() {
            axios.get('/auth/friend')
                .then((res) => {
                    this.friends = res.data;
                }).catch((err) => {
                console.log(err);
            });
        },
        methods: {
          addFriend: function() {
              this.$bvModal.show('newAddFriendModal');
          }
        },
        props: {
            msg: String
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .index {
        height: 100%;
    }
</style>
