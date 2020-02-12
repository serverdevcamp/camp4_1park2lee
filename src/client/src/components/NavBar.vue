<template>

    <nav class="navbar navbar-light bg-dark">
        <router-link :to='{name: "Friend"}' class="navbar-brand text-light" >훈민정음</router-link>
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active text-light">
            </li>
        </ul>
        <span class="navbar-text pr-2">
            <router-link :to='{name: "FriendRequests"}'><i class="nav-icon text-light"><font-awesome-icon icon="users"/></i></router-link>
        </span>
        <span class="navbar-text">
            <router-link :to='{name: "AddFriend"}'><i class="nav-icon text-light"><font-awesome-icon icon="user-plus"/></i></router-link>
        </span>
    </nav>

</template>

<script>
    export default {
        name: 'nav-bar'
    }
</script>

<style scoped>
    .navbar-branch {
        font-weight: bold !important;
    }

    .nav-icon {
        font-size: 20px;
    }
</style>
