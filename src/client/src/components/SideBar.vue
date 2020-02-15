<template>

    <div id="side-bar d-flex flex-column">

        <profile class="pt-1 pb-3"/>

        <div class="pt-2 px-1">
            <p class="text-light font-weight-light mb-1">전체 단어 순위</p>
            <ol id="total">
                <li class="list-group-item" v-for="rank in ranks" :key="rank.correct">
                    <span class="rank-context">{{ rank.wrong + ' → ' + rank.correct }}</span>

                </li>
            </ol>
            <div v-if="this.$store.state.loggedin === true">
                <p class="text-light font-weight-light mb-1">개인 단어 순위</p>
                <ol id="user">
                    <li class="list-group-item" v-for="user in users" :key="user.correct">
                        <span class="rank-context">{{ user.wrong + ' → ' + user.correct}}</span>
                    </li>
                </ol>
            </div>
        </div>
    </div>

</template>

<script>
    import Profile from './Profile'
    import axios from "axios";


    export default {
        name: 'side-bar',
        components: {
            'profile': Profile
        },
        methods:{
            updateTotal: function () {
                axios.get('/spell')
                    .then((response) => {
                        delete response.data.rank_cnt;
                        this.ranks = response.data;

                    }).catch((err) => {
                    console.log(err);
                });
            },
            updateUser: function (userId){
                if (this.$store.state.loggedin) {
                    axios.get(`/spell/${userId}`)
                        .then((response) => {
                            delete response.data.user_id;
                            delete response.data.rank_cnt;
                            this.users = response.data;
                        }).catch((err) => {
                        console.log(err);
                    });
                }
            }
        },
        created(){
          this.updateTotal();
        },
        mounted(){
            this.$store.watch(this.$store.getters.getUser, user => {
                this.updateTotal();
                if(typeof user != "undefined")
                this.updateUser(user);
            })
        },
        data: function () {
            return {
                ranks: [],
                users: [],
            }
        }
    }
</script>

<style scoped>

    .rank-context {
        font-size: 80%;
    }

    .rank-title {
        padding-top: 30px;
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
