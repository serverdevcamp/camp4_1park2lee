<template>

  <div class="container">
    <h3 id="room">Chatting</h3>
    <div class="container" style="height: 700px;">
      <ul id="chat">
        <li></li>
      </ul>
    </div>
    <form class="form-horizontal" id="chatting">
      <div class="form-group">
        <label for="msg" class="col-sm-2 control-label">Message</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="msg" placeholder="Message">
        </div>
      </div>
      <div class="form-group">
        <div class=" col-sm-offset-2 col-sm-10">
        <input type="submit" id="send" class="send" value="Send" style="width: 50px;" />
        <input type="submit" id="exit" class="exit" value="Exit" style="width: 50px;" />
        </div>
      </div>
      </form>
  </div>

</template>

<script>

export default {
  name: 'Room',
  components: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
