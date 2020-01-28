<template>
  <div class="wrap">
    <h1>Users</h1>
    <ul id="users">
      <li class="list-group-item" v-for="user in users" :key="user.id">
        {{ user.email }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  created () {
    this.$http.get('/api/users')
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