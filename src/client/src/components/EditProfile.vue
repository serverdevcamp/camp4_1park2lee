<template>
    <div id="'edit-profile">
        <b-card class="m-3 mt-5">
            <b-alert :show="success" variant="success" >저장되었습니다</b-alert>
            <form @submit.prevent="edit" class="form-profile" method="post">
                <div class="form-group">
                    <label for="nickname" class="form-label mr-auth">가명:</label>
                    <input v-model="profile.nickname" type="text" class="form-control" id="nickname">
                </div>
                <div class="form-group">
                    <label for="profile_message" class="form-label mr-auth">대화명:</label>
                    <input v-model="profile.profile_message" type="text" class="form-control" id="profile_message">
                </div>
                <button type="submit" class="btn btn-primary" value="submit">저장하기</button>
            </form>
       </b-card>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: "EditProfile",
        data() {
            return {
                success: false,
                profile: {}
            }
        },
        methods: {
            edit() {
                console.log(this.profile);
                let self = this;
                axios.post('/auth/profile/edit', this.profile)
                    .then((response) => {
                        console.log("response:" + response);
                        self.$store.commit('updateUser');
                        self.success=true;
                    }).catch((err) => {
                        console.log("Cannot update profile:" + err);
                    }
                )
            }
        }
    }
</script>

<style scoped>


</style>