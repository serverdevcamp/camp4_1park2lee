<template>
    <div class="pt-5 profile d-flex flex-column">
        <div v-if="this.$store.state.loggedin === false">
            <div class="d-flex flex-column card m-2">
                <i class="profile-photo">
                    <font-awesome-icon icon="user-secret"/>
                </i>
                <div>
                    <p>로그인이 필요합니다! </p>
                </div>
            </div>
            <div class="d-flex flex-column card m-2">
                <router-link :to="{name: 'Login'}">
                    <button class="btn btn-sm btn-light">로그인</button>
                </router-link>
            </div>
        </div>

        <div v-else>
            <div class="d-flex flex-column card m-2">
                <div>
                    <router-link :to="{name:'EditProfile'}" class="text-dark small">
                        edit
                        <font-awesome-icon icon="pencil-alt"/>
                    </router-link>
                </div>
                <div>
                    <img :src="user_img" width="100px" height="100px">
                </div>
                <p class="">{{this.user.nickname}}</p>
                <p class="">{{this.user.profile_message}}</p>
            </div>
            <div class="d-flex flex-column card m-2">
                <router-link :to='{ name: "Room", params: {user_id: this.$store.state.user.id, room_number:null}}' tag="button" class="btn btn-sm btn-light">나와의 채팅</router-link>
            </div>
            <div class="d-flex flex-column card m-2">
                <button v-on:click="logout" class="btn btn-sm btn-light">
                    logout
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "Profile.Vue",
        data: function () {
            return {
                user: this.$store.state.user,
                user_img: this.$store.state.user_img
            }
        },
        created: function () {

        },
        methods: {
            logout: function () {
                let self = this;
                axios.get('/auth/account/logout')
                    .then(function () {
                        self.$store.commit('updateUser');
                        self.$store.commit('updateUserImg');
                        document.location.href = "/";
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }
        },
        mounted() {
            let self = this;
            this.$store.watch(this.$store.getters.getUserInfo, user => {
                self.user = user;
            });
            this.$store.watch(this.$store.getters.getUserImg, user_img => {
                self.user_img = user_img;
            });

        }
    }

</script>

<style scoped>
    .profile-photo {
        font-size: 100px;
    }
</style>