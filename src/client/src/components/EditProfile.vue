<template>
    <div id="edit-profile">
        <b-modal id="newEditProfileModal" hide-footer>

            <template v-slot:modal-title>
                프로필 수정하기
            </template>
            <div class="mb-3 card">
                <div>
                    <div class="form-group">
                        <label for="file">프로필 사진 변경</label>
                        <input ref="file" v-on:change="handleFileUpload()" type="file"
                               class="form-control-file form-control"
                               id="file"
                               name="file"/>
                    </div>
                    <button class="btn btn-primary" v-on:click="submitFile()">올리기</button>
                </div>
            </div>
            <div class="card">
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
            </div>
        </b-modal>
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
                // init_message:this.$store.state.user.nickname,
                // init_nickname: this.$store.state.user.profile_message
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
                        this.$toasted.show("성공적으로 업데이트 했습니다.", {
                            theme: "toasted-primary",
                            icon: 'faCheck',
                            type: 'success',
                            position: "top-right",
                            duration: 3000
                        });
                    }).catch((err) => {
                        console.log("Cannot update profile:" + err);
                        this.$toasted.show("이미지의 용량이 너무 크거나 잘못된 파일 형식이 입니다.", {
                            theme: "toasted-primary",
                            icon: 'faCheck',
                            type: 'error',
                            position: "top-right",
                            duration: 3000
                        });
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
                        this.$toasted.show("성공적으로 사진을 변경했습니다.", {
                            theme: "toasted-primary",
                            icon: 'faCheck',
                            type: 'success',
                            position: "top-right",
                            duration: 3000
                        });

                    }).catch((err) => {
                    console.log("Cannot update profile:" + err);
                });
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    #edit-profile {
        height: 100%;
        background-color: #f5f5f5;
    }

    .card {
        width: 100%;
        max-width: 400px;
        padding: 15px;
        margin: auto;
    }

</style>
