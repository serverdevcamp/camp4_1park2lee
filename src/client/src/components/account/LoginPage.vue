<template>

    <!-- <div>
        <h2></h2>
        <form @submit.prevent="login">
            <input v-model="user.email" type="text" name="email">
            <input v-model="user.password" type="password" name="password">
            <input type="submit" value="submit">
        </form>
    </div> -->

    <div id="login-page">

        <form @submit.prevent="login" class="form-signin" method="post">
            <div class="text-center pb-3">
                <p class="h1"><i class="fas fa-user"></i></p><br>
                <p class="h4">훈민정음에 로그인하기</p>
                {{error}}
            </div>
            <div class="card p-3 mt-3">
                <div class="input-group mb-2 d-flex flex-column">
                    <label class="align-self-start" for="email">이메일</label>
                    <input v-model="user.email" type="email" name="email" id="email" class="form-control" required
                           autofocus>
                </div>
                <div class="input-group mb-4 d-flex flex-column">
                    <div class="d-flex justify-content-between">
                        <label for="password">비밀번호</label>
                        <a href="/reset" class="ml-auto">비밀번호 찾기</a>
                    </div>
                    <input v-model="user.password" type="password" name="password" id="password" class="form-control"
                           required>
                </div>
                <input class="btn btn-lg btn-primary btn-block" type="submit" value="submit">
                <a href="/oauth" class="btn btn-block btn-lg btn-warning btn_login">KaKao</a>

            </div>
            <div class="card pt-3 mt-3 text-center">
                <p>계정이 없으시다구요? <a href='/register'>회원가입</a>하기!</p>
            </div>

        </form>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: 'Login',
        created() {
            axios.get('/auth/user')
                .then((response) => {
                    console.log("test:", response.data.user);
                    if (response.data.user !== undefined) {
                        this.$store.commit('updateUser');
                        this.$store.commit('updateUserImg');

                        document.location.href = "friend";
                    }
                });
        },
        data() {
            return {
                result: "hoho",
                error: null,
                user: {}
            }
        },
        methods: {
            login() {
                this.error = "";
                axios.post('/auth/account/login', this.user)
                    .then((response) => {
                            console.log("response:" + response);
                            this.$store.commit('updateUser');
                            document.location.href = "/friend";
                        }
                    ).catch((err) => {
                        // console.log(self);
                        console.log("Cannot log in" + err);
                        console.log("response::" + JSON.stringify(err.response.data[2].message));
                        this.error = err.response.data[2].message;
                    }
                )
            }
        }
    }
</script>

<style scoped>

    .form-signin,
    .form-signup {
        width: 100%;
        max-width: 350px;
        padding: 15px;
        margin: auto;
    }

    #login-page {
        height: 100%;
        background-color: #f5f5f5;
    }

</style>