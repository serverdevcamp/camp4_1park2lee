<template>
    <div class="pt-5 profile d-flex flex-column">
        <div v-if="this.$store.state.loggedin === false">

            <i class="profile-photo text-light">
                <font-awesome-icon icon="user-secret"/>
            </i>
            <div>
                <p class="text-light">로그인이 필요합니다! </p>
                <router-link :to="{name: 'Login'}">
                    <button class="win-98">로그인</button>
                </router-link>
            </div>

        </div>
        <div v-else>

            <router-link :to="{name:'EditProfile'}">
                <font-awesome-icon icon="pencil-alt"/>
            </router-link>
            <img :src="user_img" width="100px" height="100px">
            <p class="text-light">{{this.user.nickname}}</p>
            <p class="text-light">{{this.user.profile_message}}</p>
            <button v-on:click="logout">
                logout
            </button>

        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "Profile.Vue",
        data: function() {
            return {
                user:this.$store.state.user,
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
                        document.location.href = "/";
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }
        },
        mounted(){
            let self = this;
            this.$store.watch(this.$store.getters.getUserInfo, user=> {
                self.user = user;
            });
            this.$store.watch(this.$store.getters.getUserImg, user_img=> {
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