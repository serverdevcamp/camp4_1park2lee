<template>

  <div class="index">
    <h1 class="h4 pt-5">훈민정음 짱짱</h1>
    <router-link :to='{ name: "RoomList", params: {user_id: 1}}'>1번유저의 대화방</router-link>
    <router-link :to='{ name: "RoomList", params: {user_id: 2}}'>2번유저의 대화방</router-link>

  </div>
</template>

<script>

export default {
  name: 'Index',
  components: {

  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.index{
  height: 100%;
}
</style>
