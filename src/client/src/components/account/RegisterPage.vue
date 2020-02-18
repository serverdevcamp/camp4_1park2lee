<template>
    <div id="register-page">


        <h1 class="h3 mb-3 mt-3 font-weight-normal">회원가입 하시지요!</h1>
        <b-alert :show="hasError" variant="danger"> {{error}} </b-alert>
        <form @submit.prevent="register" class="form-register card" method="post">

            <div class="input-group mb-3 d-flex flex-column">
                <label class="align-self-start" for="name">이름</label>
                <input v-model="user.name" type="name" name="name" id="name" class="form-control" placeholder="Name"
                       required>
            </div>

            <div class="input-group mb-3 d-flex flex-column">
                <label class="align-self-start" for="email">이메일</label>
                <input v-model="user.email" type="email" name="email" id="email" class="form-control"
                       placeholder="Email address" required autofocus>
            </div>


            <div class="input-group mb-3 d-flex flex-column">
                <label class="align-self-start" for="password">비밀번호</label>
                <div class="d-flex flex-row">
                    <div></div>
                <input v-model="user.password" :type="passwordFieldType" name="password" id="password"
                       class="form-control" placeholder="Password" required>
                <button type="password" @click="switchVisibility" class="btn btn-light ml-2"><font-awesome-icon :icon="eye"/></button>
                </div>
            </div>

            <input class="btn btn-lg btn-primary btn-block" type="submit" value="회원가입">

        </form>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: 'Register',
        created() {
        },
        data() {
            return {
                error: "",
                user: {},
                passwordFieldType: 'password',
                eye: "eye",
                hasError: false
            }
        },
        methods: {
            register: function () {
                this.error = "";
                if(this.checkPassword(this.user.password))
                {

                    axios.post('/auth/account/register', this.user)
                        .then((response) => {
                            console.log("response:" + response.data);
                            this.$router.push('confirm');
                            this.$toasted.show("성공적으로 회원가입을 했습니다.", {
                                theme: "toasted-primary",
                                icon: 'faCheck',
                                type: 'success',
                                position: "top-right",
                                duration: 3000
                            });
                        }).catch((err) => {
                        console.log("Cannot log in" + err);
                        console.log("response::" + JSON.stringify(err.response.data));
                        this.hasError = true;
                        this.error = err.response.data;
                    })
                }else{
                    this.error = "영문, 숫자가 포함된 6자리 이상 16자리 미만의 비밀번호를 입력해 주세요.";
                    this.hasError = true;
                }
            },
            switchVisibility: function () {
                this.passwordFieldType = (this.passwordFieldType === 'password') ? 'text' : 'password';
                this.eye = (this.passwordFieldType === 'password') ? 'eye' : 'eye-slash';
            },
            checkPassword(val){
                const reg =  /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,16}$/;
                return reg.test(val);
            }
        },
        watch: {

        }
    }
</script>

<style scoped>

    .form-register {
        width: 100%;
        max-width: 350px;
        padding: 15px;
        margin: auto;
    }

    #register-page {
        height: 100%;
        background-color: #f5f5f5;
    }


</style>