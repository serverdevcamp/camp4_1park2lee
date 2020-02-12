<template>

    <div class="index">
        <h1 class="h4 pt-5">훈민정음 짱짱</h1>
        <router-link :to='{ name: "RoomList", params: {user_id: 1}}'>1번유저의 대화방</router-link>
        <router-link :to='{ name: "RoomList", params: {user_id: 2}}'>2번유저의 대화방</router-link>
        <router-link :to='{ name: "RoomList", params: {user_id: 3}}'>3번유저의 대화방</router-link>

        <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between" v-for="friend in friends" :key="friend">
                <div>{{friend.name}}</div>
                <div>{{friend.grade}}</div>
                <div v-if="friend.status === 0">혼자친구</div>
                <div v-else>같이친구</div>
            </li>
        </ul>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: 'Index',
        components: {},
        created() {
            if(this.$store.state.loggedin) {
                this.getFriends();
            }
        },
        methods: {
            getFriends() {
                axios.get('/auth/friend')
                    .then((res) => {
                        this.friends = res.data
                    }).catch((err) => {
                    console.log(err);
                });
            }
        },
        data() {
            return {
                friends: [],
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
