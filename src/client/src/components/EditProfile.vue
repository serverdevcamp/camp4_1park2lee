<template>
    <div id="'edit-profile">
        <b-card class="m-3 mt-5">
            <div class="text-center pb-3">
                <p class="h1"><i class="fas fa-user"></i></p><br>
                <p class="h4">훈민정음에 로그인하기</p>
                {{error}}
            </div>
            <b-alert :show="success" variant="success">저장되었습니다</b-alert>
            <div>
                <div class="form-group">
                    <label for="file">파일업로드</label>
                    <input ref="file" v-on:change="handleFileUpload()" type="file" class="form-control-file" id="file"
                           name="file"/>
                </div>
                <button v-on:click="submitFile()">Submit</button>
            </div>

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
                profile: {},
                file: '',
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
                        self.success = true;
                    }).catch((err) => {
                        console.log("Cannot update profile:" + err);
                    }
                )
            },
            handleFileUpload() {
                this.file = this.$refs.file.files[0];
            },
            submitFile() {
                let self = this;
                let formData = new FormData();
                formData.append('file', this.file);

                axios.post('/auth/profile/image/upload', formData, {
                    header: {
                        'Content-Type': 'multipart/form-data'
                    }

                })
                    .then(() => {
                        self.$store.commit('updateUserImg');

                    }).catch((err) => {
                    console.log("Cannot update profile:" + err);
                });
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>


</style>