<template>

    <div id="side-bar">
        <div class="pt-5 profile">
            <i class="profile-photo text-light">
                <font-awesome-icon icon="user-secret"/>
            </i>
            <p class="text-light">반갑습니다 juyeon님!</p>
            <!-- <router-link to="login"><button class="win-98">로그인</button></router-link> -->
        </div>
        <hr>

        <p class="text-light">토탈</p>
        <ol id="users">
            <li class="list-group-item" v-for="rank in ranks" :key="rank">
                <div v-if="rank.wrong !== rank.correct">
                    {{ rank.wrong + ' : ' + rank.correct}}
                </div>
            </li>
        </ol>

        <div class="pt-5 profile">
            <p class="text-light">개인</p>
        </div>
    </div>

</template>

<script>

    import axios from "axios";

    export default {
        name: 'side-bar',
        created() {
            axios.get('/spell')
                .then((response) => {
                    this.ranks = response.data;

                }).catch((err) => {
                console.log(err);
            });
        },
        data: function () {
            return {
                ranks: []
            }
        }
    }
</script>

<style scoped>

    .profile-photo {
        font-size: 100px;
    }

    ol {
        list-style-type: none;
        margin: 0;
        padding: 10px;
    }

    li {
        font-size: 90%;
    }

</style>
