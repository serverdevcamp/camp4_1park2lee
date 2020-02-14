<template>
    <div id="friend-requests mt-3">
        <h1 class="pt-3 mt-3">친구 요청이 왔어요</h1>
        <ul class="list-group m-3">
            <li class="list-group-item d-flex justify-content-between" v-for="(friend, index) in friends" :key="friend">
                <div>{{friend.name}}</div>
                <div>{{friend.email}}</div>
                <div>
                    <button class="btn btn-light mr-2" v-on:click="accept($event, friend,index)">좋소</button>
                    <button class="btn btn-light" v-on:click="refuse($event, friend, index)">싫소</button>
                </div>
            </li>
        </ul>
    </div>

</template>

<script>
    import axios from "axios"

    export default {
        name: "FriendRequests",
        created() {
            axios.get('/auth/friend/request')
                .then((res) => {
                    this.friends = res.data
                }).catch((err) => {
                    console.log(err);
            })
        },
        data() {
            return {
                friends: [],
            }
        },
        methods:{
            accept: function(event, friend, idx){
                axios.post('/auth/friend/request/reply',{id:friend.id, status:1})
                    .then(() => {
                        this.friends.splice(idx,1);
                    }).catch((err) => {
                    console.log(err);
                });
            },
            refuse: function(event, friend, idx){
                axios.post('/auth/friend/request/reply',{id:friend.id, status:0})
                    .then(() => {
                        this.friends.splice(idx,1);
                    }).catch((err) => {
                    console.log(err);
                });
            }

        }
    }
</script>

<style scoped>

#friend-requests{
    height: 100%;
    background-color: #f5f5f5;
}

</style>