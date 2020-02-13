<template>

  <div class="container">
    <h3 class="pt-5 pb-2">{{user_id}}'s Room List</h3>

    <div class="container" style="height: 700px;">
      <ul class="rooms list-group">
        <li v-for="room in rooms" :key="room.id" class="list-group-item">
          <span>{{room.name}}</span>
          <span>{{room.member}}</span>
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
