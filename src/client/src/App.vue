<template>
    <!DOCTYPE html>
    <html lang="ko">
  
  <head>
    <link rel='stylesheet' href='win98.css'>
    <link rel='stylesheet' href='bootstrap-social.css'>
  </head>
  <body>
      <div id = "app">
        <div class="nav-bar">
          <nav-bar/>
        </div>
        <div class="wrapper">
          <div class="side-bar bg-dark">
            <side-bar/>
          </div>
          <div class="content">
            <router-view></router-view>
          </div>
        </div>
      </div>
  </body>
  </html>



</template>

<script>


    import SideBar from './components/SideBar'
    import NavBar from './components/NavBar'

    export default {
        name: 'app',
        created: function () {
            this.$store.commit('updateUser');
        },
        components: {
            'nav-bar':
            NavBar,
            'side-bar':
            SideBar
        }
    }
</script>
<style>

    @font-face {
        font-family: 'DOSMyungjo';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_eight@1.0/DOSMyungjo.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    @font-face {
        font-family: 'Chosunilbo_myungjo';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    @import url('https://fonts.googleapis.com/css?family=Song+Myung&display=swap&subset=korean');
    #app {
        font-family: 'Song Myung', 'DOSMyungjo', 'Chosunilbo_myungjo', 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .side-bar {
        width: 250px;
    }

    .content {
        width: 100% !important;
        left: 250px;
        right: 0;
    }

    .wrapper {
        height: auto !important;
        width: 100%;
        position: absolute;
        display: flex;
        top: 50px;
        bottom: 0;
    }

    .nav-bar {
        height: 50px;
        z-index: -1;
    }

    html, body, #app, section.section {
        height: 100%;
    }
</style>
