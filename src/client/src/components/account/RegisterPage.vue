<template>
  <div id="register-page">
        <form action="/register" class="form-register" method="post">
			<img class="mb-4" src="/docs/4.4/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
			<h1 class="h3 mb-3 font-weight-normal">회원가입 하시지요!</h1>
			
			<div class="input-group mb-3">
				<label for="name" class="sr-only">Username</label>
				<input type="name" name= "name" id="name" class="form-control" placeholder="Name" required>
			</div>

			<div class="input-group mb-3">
				<label for="email" class="sr-only">Email address</label>
				<input type="email" name="email" id="email" class="form-control" placeholder="Email address" required autofocus>
			</div>


			<div class="input-group mb-3">
				<label for="password" class="sr-only">Password</label>
				<input type="password" name= "password" id="password" class="form-control" placeholder="Password" required>
			</div>

			<button class="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
		</form>
  </div>
</template>
<script>
export default {
    name: 'register-page',
    created () {
    this.$http.get('/api/register')
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

.form-register{
  width: 100%;
  max-width: 350px;
  padding: 15px;
  margin: auto;
}

#register-page{
    height: 100%;
    background-color: #f5f5f5;
}

</style>