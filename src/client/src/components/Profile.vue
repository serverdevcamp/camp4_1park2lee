<template>
    <div class="pt-5 profile d-flex flex-column">
        <div v-if="this.$store.state.loggedin === false">
            <i class="profile-photo text-light">
                <font-awesome-icon icon="user-secret"/>
            </i>
            <div>
                <p class="text-light">로그인이 필요합니다! </p>
                <router-link to="login">
                    <button class="win-98">로그인</button>
                </router-link>
            </div>
        </div>
        <div v-else>
            <p class="text-light">반갑습니다 {{this.$store.state.user.name}}님!</p>
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
        created: function () {

        },
        methods: {
            logout: function () {
                let self = this;
                axios.get('/auth/account/logout')
                    .then(function(){
                        self.$store.commit('updateUser');
                        self.$router.replace({path: '/'});
                    })
                    .catch(function(err){
                        console.log(err);
                    })
            }
        }
    }

</script>

<style scoped>
    .profile-photo {
        font-size: 100px;
    }
</style>