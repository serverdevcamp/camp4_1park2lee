<template>
  <div id="register-page">
        <form @submit.prevent="register" class="form-register" method="post">
			<h1 class="h3 mb-3 font-weight-normal">회원가입 하시지요!</h1>
            {{error}}
			<div class="input-group mb-3">
				<label for="name" class="sr-only">Username</label>
				<input v-model="user.name" type="name" name= "name" id="name" class="form-control" placeholder="Name" required>
			</div>

			<div class="input-group mb-3">
				<label for="email" class="sr-only">Email address</label>
				<input v-model="user.email" type="email" name="email" id="email" class="form-control" placeholder="Email address" required autofocus>
			</div>


			<div class="input-group mb-3">
				<label for="password" class="sr-only">Password</label>
				<input v-model="user.password" type="password" name= "password" id="password" class="form-control" placeholder="Password" required>
			</div>

			<input class="btn btn-lg btn-primary btn-block" type="submit" value="회원가입">
		</form>
  </div>
</template>

<script>
import axios from "axios"
export default {
    name: 'Register',
    created () {
    },
    data () {
        return {
            error: "haha",
            user: {
                
            }
        }
    },
    methods: {
        register(){
            this.error=""
            axios.post('/auth/account/register', this.user)
            .then( (response) =>{
                console.log("response:"+response);
				this.$router.push('confirm');
            }).catch((err) => {
                console.log("Cannot log in"+ err);
                console.log("response::"+JSON.stringify(err.response.data));
                this.error = err.response.data;					
            })
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