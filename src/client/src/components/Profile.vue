<template>
    <div class="profile d-flex flex-column">
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
            <div class="d-flex flex-column card bg-light m-2">
                <div>
                    <a @click="editProfile" class="text-dark small">
                        edit
                        <font-awesome-icon icon="pencil-alt"/>
                    </a>
                </div>
                <div class="img_wrapper" >
                    <img :src="user_img" style="width: 100px; height: 100px;" class="rounded-circle img mt-1">
                </div>
                <span class="mt-1">{{this.$store.state.user.nickname}}</span>
                <span class="mt-1">{{this.$store.state.user.profile_message}}</span>
                <span class="my-1">{{this.$store.state.user.grade}}</span>


            </div>
            <div class="row mx-auto px-2 align-items-center justify-content-center">
                    <router-link :to='{ name: "Room", params: {user_id: [this.$store.state.user.id], room_number:this.$store.state.user.myroom}}'
                                 tag="button"
                                 class="btn btn-sm btn-light col-6 border-dark"
                                 style="font-size: smaller">
                        나와의 채팅
                    </router-link>
                    <button v-on:click="logout" class="btn btn-sm btn-light col-6 border-dark" style="font-size: smaller">퇴장</button>

            </div>

            <div>
                <edit-profile></edit-profile>
            </div>

        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import EditProfile from "./EditProfile";

    export default {
        name: "Profile.Vue",
        data: function () {
            return {
                user_img : this.$store.state.user_img
            }
        },
        created: function () {
        },
        components: {
            'edit-profile' : EditProfile
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
            },
            editProfile: function() {
                this.$bvModal.show('newEditProfileModal');
            }
        },
        mounted() {
            let self = this;
            this.$store.watch(this.$store.getters.getUserImg, user_img => {
                self.user_img = user_img;
            });

        }
    }

</script>

<style scoped>

    /*div.img_wrapper{*/
        /*width: 100px;*/
        /*height: 100px;*/
    /*}*/


    .profile-photo {
        font-size: 100px;
    }
</style>