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
                <li class="list-group-item d-flex justify-content-between" v-for="friend in friends" :key="friend">
                    <div>{{friend.name}}</div>
                    <div>{{friend.grade}}</div>
                    <div v-if="friend.status === 0">혼자친구</div>
                    <div v-else>같이친구</div>
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
                    this.friends = res.data
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
