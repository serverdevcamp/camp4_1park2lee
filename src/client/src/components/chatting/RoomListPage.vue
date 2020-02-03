<template>

  <div class="container">
    <h3>{{user_id}}'s Room List</h3>

    <div class="container" style="height: 700px;">
      <ul class="rooms">
        <li v-for="room in rooms" :key="room.id">
          {{room.name}}
          {{room.member}}
          <router-link :to='{ name: "Room", params: {user_id: user_id, room_number:room.id} }'>채팅하기</router-link>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>

export default {
  name: 'RoomList',
  created: function(){
    let user_id = this.$route.params.user_id;
    this.$http.get(`/api/room/${user_id}`)
    .then((response)=>{
        this.rooms = response.data
        this.user_id = user_id;
    })
  },
  data : function(){
    return{
      rooms: [],
      user_id:""
    }
  },
  components: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
