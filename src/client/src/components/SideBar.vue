<template>

  <div id="side-bar">
  <div class="pt-5 profile">
    <i class="profile-photo text-light"><font-awesome-icon icon="user-secret" /></i>
    <p class="text-light">로그인을 해주시오</p>
    <router-link to="login" class="btn btn-outline-success my-2 my-sm-0">Sign in</router-link>
  </div>
  </div>

</template>
 
<script>
export default {
  name: 'side-bar'
}
</script>
 
<style scoped>

.profile-photo{
  font-size:100px;
}

</style>
