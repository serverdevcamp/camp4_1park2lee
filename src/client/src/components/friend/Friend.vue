<template>

    <div class="index">
        <h1 class="h4 pt-5">친구 목록</h1>

        <div v-if="this.$store.state.loggedin === false">
            <div>
                <p class="text-dark">로그인을 먼저 해주세요! </p>
            </div>
        </div>
        <div v-else>
            <ul class="list-group my-3">
                <li class="list-group-item justify-content-between row align-self-center w-75" v-for="friend in friends" :key="friend">
                    <div class="row">
                        <div class="col-1 align-self-center">
                            <img :src="friend.image_path" class="rounded-circle" width="30px" height="30px">
                        </div>
                        <div class="col-5 align-self-center">
                            <div class="row">
                                <div class="text-left">{{friend.nickname}}</div>
                            </div>
                            <div class="row mb-n4 my-auto">
                                <small>{{friend.profile_message}}</small>
                            </div>
                        </div>
                        <div class="col-1 align-self-center">{{friend.grade}}</div>
                        <div class="col-4 align-self-center">
                            <div v-if="friend.status === 0"> 혼자친구</div>
                            <div v-else >같이친구</div>
                        </div>
                        <div class="col-1">
                            <div class="my-2 mr-1 btn" @click="friendChat(friend.id)"><font-awesome-icon icon="comment" class="fa-2x"/></div>
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
        methods: {
            friendChat: function (id) {
                console.log('fchat:',id);
            }
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
