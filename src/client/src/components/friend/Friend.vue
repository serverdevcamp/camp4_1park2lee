<template>

    <div class="Friend">

        <div class="mt-5 d-flex justify-content-between mb-2">
            <div></div>
            <div>
                <h1 class="h4">훈민정음</h1>
            </div>
            <!--{{friends}}-->
            <div  class="pr-2">
                <button class="btn btn-primary btn-lg rounded-circle shadow-lg" @click="addFriend" ><i class="nav-icon"><font-awesome-icon class="mt-2 mb-1" icon="user-plus"/></i></button>
                <!--<router-link :to='{name: "AddFriend"}'><i class="nav-icon"><font-awesome-icon icon="user-plus"/></i></router-link>-->
            </div>
        </div>

        <div v-if="this.$store.state.loggedin === false">
            <div>
                <p class="text-dark">로그인을 먼저 해주세요! </p>
            </div>
        </div>
        <div v-else>
            <ul class="list-group my-3">
                <li class="list-group-item  align-self-center w-75" v-for="friend in this.$store.state.friends" :key="friend.id">
                    <div class="row justify-content-between">
                        <div class="col-2 col-md-2  align-self-center">
                            <img :src="friend.image_path" class="rounded-circle" width="30px" height="30px">
                        </div>
                        <div class="col-auto col-md-3 align-self-center">
                            <div class="row">
                                <div class="text-left">{{friend.nickname}}</div>
                            </div>
                            <div class="row mb-4 my-auto">
                                <small>{{friend.profile_message}}</small>
                            </div>
                        </div>
                        <div class="col-2 align-self-center">{{friend.grade}}</div>
                        <div class="col-2 align-self-end">
                            <div class="btn" @click="friendChat(friend.id)"><font-awesome-icon icon="comment" class="fa-2x"/></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <div>
            <add-friend/>
        </div>

    </div>
</template>

<script>
    // import axios from "axios"
    import AddFriend from "./AddFriend";

    export default {
        name: 'friend',
        components: {
            'add-friend' : AddFriend
        },
        created() {

        },
        methods: {
            friendChat: function (id) {
                console.log('fchat:',id);
            },
            addFriend: function() {
                this.$bvModal.show('newAddFriendModal');
            },
        },
        mounted() {
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
