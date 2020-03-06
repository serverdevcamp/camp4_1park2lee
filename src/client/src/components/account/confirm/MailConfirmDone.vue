<template>
    <div id="confirm-mail-done" class="p-3">
        <div class="card mt-3">
            {{ result }}
            {{ message }}
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    export default {
        name: 'ConfirmMailDone',
        created () {
            let token =  this.$route.params.token;
            let self = this;
            console.log(token);
            axios.get(`/auth/account/confirm/${token}`)
                .then((response)=>{
                    console.log(response.data);
                    self.result = response.data;
                    self.message = "성공적으로 인증되었습니다.";
                })
                .catch((err)=>{
                    self.result = err.data;
                    self.message = "해당 URL이 만료되었습니다. 인증메일을 재생성 해주세요!";

                });
        },
        data () {
            return {
                result : "",
                message: "",
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

    .card{
        width: 100%;
        max-width: 350px;
        padding: 15px;
        margin: auto;
    }

    #confirm-mail-done{
        height: 100%;
        background-color: #f5f5f5;
    }

</style>
