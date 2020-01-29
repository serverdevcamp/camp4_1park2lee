<template>
  <div id="login-page">
    <form action="/signin" class="form-signin" method="post">
			<div class="text-center pb-3">
					<p class="h1"><i class="fas fa-user"></i></p><br>
					<p class="h4">훈민정음에 로그인하기</p>		
			</div>

			<div class="card p-3 mt-3">
				<div class="input-group mb-2 d-flex flex-column">
					<label class="align-self-start" for="email">이메일</label>
					<input type="email" name="email" id="email" class="form-control" required autofocus>
				</div>
				<div class="input-group mb-4 d-flex flex-column">
					<div class="d-flex justify-content-between">
						<label for="password">비밀번호</label>
						<a href="/reset" class="ml-auto">비밀번호 찾기</a>
					</div>
					<input type="password" name= "password" id="password" class="form-control" required>
				</div>
				<button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
				<a href="/oauth" class="btn btn-block btn-lg btn-warning btn_login">KaKao</a>

			</div>
			<div class="card pt-3 mt-3 text-center">
				<p>계정이 없으시다구요? <a href='/register'>회원가입</a>하기!</p>
			</div>

		</form>
  </div>
</template>
<script>
export default {
    name: 'login-page',
    created () {
    this.$http.get('/api/login')
        .then((response) => {
            this.users = response.data
        })
    },
    data () {
        return {
            users: []
        }
    }
}
</script>

<style scoped>

.form-signin,
.form-signup{
  width: 100%;
  max-width: 350px;
  padding: 15px;
  margin: auto;
}

#login-page{
    height: 100%;
    background-color: #f5f5f5;
}

</style>