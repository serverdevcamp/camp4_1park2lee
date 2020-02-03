<template>

  <div id="side-bar">
  <div class="pt-5 profile">
    <i class="profile-photo text-light"><font-awesome-icon icon="user-secret" /></i>
    <p class="text-light">로그인을 해주시오</p>
    <router-link to="login"><button class="win-98">Sign in</button></router-link>
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
