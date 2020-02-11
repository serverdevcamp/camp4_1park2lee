<template>

    <div id="side-bar d-flex flex-column">
        <div class="pt-5 profile">
            <i class="profile-photo text-light">
                <font-awesome-icon icon="user-secret"/>
            </i>
            <!--<p class="text-light">반갑습니다 juyeon님!</p>-->
        </div>
        <div>
            <p class="text-light">로그인이 필요합니다! </p>
            <router-link to="login">
                <button class="win-98">로그인</button>
            </router-link>
        </div>

    </div>

</template>

<script>

    export default {
        name: 'side-bar'
    }
</script>

<style scoped>

    .profile-photo {
        font-size: 100px;
    }

</style>
