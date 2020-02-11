<template>

    <div id="side-bar d-flex flex-column">

        <profile class="pt-5 pb-3"/>

        <div class="rank-title">
            <p class="text-light">전체 단어 순위</p>
            <ol id="total">
                <li class="list-group-item" v-for="rank in ranks" :key="rank.correct">
                    <span class="rank-context">{{ rank.wrong + ' → ' + rank.correct }}</span>

                </li>
            </ol>
            <p class="text-light">개인 단어 순위</p>
            <ol id="user">
                <li class="list-group-item" v-for="user in users" :key="user.correct">
                    <span class="rank-context">{{ user.wrong + ' → ' + user.correct}}</span>
                </li>
            </ol>
        </div>
    </div>

</template>

<script>
    import Profile from './Profile'
    import axios from "axios";


    export default {
        name: 'side-bar',
        components:{
            'profile': Profile
        },
        created() {
            axios.get('/spell')
                .then((response) => {
                    delete response.data.rank_cnt;
                    this.ranks = response.data;

                }).catch((err) => {
                console.log(err);
            });
            axios.get('/spell/1')
                .then((response) => {
                    delete response.data.user_id;
                    delete response.data.rank_cnt;
                    this.users = response.data;
                }).catch((err) => {
                console.log(err);
            });
        },
        data: function () {
            return {
                ranks: [],
                users: []
            }
        }
    }
</script>

<style scoped>

    .rank-context{
        font-size: 80%;
    }
    .rank-title {
        padding-top: 10px;
    }

    .rank-count {
        font-size: 85%;
        margin: 0px;
        padding-left: 5px;
    }

    ol {
        list-style-type: none;
        margin: 0;
        padding: 5px;
        padding-top: 0px;
        padding-bottom: 20px;
    }

    li {
        margin-bottom: 1px;
        padding: 5%;
        padding-left: 2px;
        padding-right: 2px;
    }

</style>
