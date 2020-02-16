<template>

    <div class="index">
        <h1 class="h4 pt-5">훈민정음</h1>

        <div v-if="this.$store.state.loggedin === false">
            <div>
                <p class="text-dark">로그인을 먼저 해주세요! </p>
            </div>
            <router-link :to='{ name: "RoomList", params: {user_id: 1}}'>1번 유저의 대화방</router-link>
            <router-link :to='{ name: "RoomList", params: {user_id: 2}}'>2번 유저의 대화방</router-link>
            <router-link :to='{ name: "RoomList", params: {user_id: 3}}'>3번 유저의 대화방</router-link>


        </div>
        <div v-else>
            <router-link :to='{ name: "RoomList" }'>내 대화방</router-link>

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
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: 'Index',
        components: {},
        created() {
        },
        methods: {},
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
