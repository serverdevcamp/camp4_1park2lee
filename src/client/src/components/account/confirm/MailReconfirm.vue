<template>
    <div id="reconfirm-mail" class="p-3">
       {{err}}
        <div class="card">
            <h4>이메일 재인증</h4>
            <form @submit.prevent="reconfirm" method="post">
                <div class="input-group mb-2 d-flex flex-column">
                    <label class="align-self-start" for="email">이메일</label>
                    <input v-model="form.email" type="email" name="email" id="email" class="form-control" required
                           autofocus>
                </div>
                <input class="btn btn-lg btn-primary btn-block" type="submit" value="인증메일 보내기">
            </form>
        </div>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: 'MailReconfirm',
        created() {
        },
        data() {
            return {
                form: {},
                err: ""
            }
        },
        methods: {
            reconfirm() {
                axios.post('/auth/account/confirm', this.form)
                    .then((response) => {
                        console.log("response"+response.data);
                        this.$router.push('confirm');
                        }
                    ).catch((err) => {
                        console.log("err"+ err.data);
                        this.err = "유효하지 않는 이메일 입니다.";
                    }
                )
            }
        }
    }
</script>

<style scoped>

    .card {
        width: 100%;
        max-width: 350px;
        padding: 15px;
        margin: auto;
    }

    #reconfirm-mail {
        height: 100%;
        background-color: #f5f5f5;
    }

</style>