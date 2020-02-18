<template>
    <div id="add-friend">
        <b-modal id="newAddFriendModal" hide-footer>
            <template v-slot:modal-title>
                친구 요청하기
            </template>
            <form @submit.prevent="addFriend" method="post">
                <div class="input-group mb-2 d-flex flex-column">
                    <label class="align-self-start" for="email">이메일</label>
                    <input v-model="friend.email" type="email" name="email" id="email" class="form-control" required
                           autofocus>
                </div>
                <input class="btn btn-lg btn-primary btn-block" type="submit" value="submit">
            </form>
        </b-modal>
    </div>
</template>

<script>
    import axios from "axios";
    import io from "socket.io-client";

    export default {
        name: "AddFriend",
        data() {
            return {
                result: "",
                friend: {},
                socket: io('localhost:3000/friend'),
                userId: null
            }
        },
        mounted() {
            this.$store.watch(this.$store.getters.getUserLogin, isLogin => {
                this.isLogin = isLogin;
                if (!isLogin) {
                    if (this.userId != null && typeof this.userId != "undefined") {
                        this.userId = null;
                    }

                } else {
                    this.userId = this.$store.state.user.id;
                }
            });
        },
        methods: {


            addFriend() {
                this.error = "";
                let self = this;
                axios.post('/auth/friend/add', this.friend)
                    .then((res) => {
                        console.log("response:" + res.data);
                        console.log(self.socket);

                        self.socket.emit("client friend req", {
                            user: res.data
                        });

                        self.$bvModal.hide('newAddFriendModal');
                        this.$toasted.show("친구요청을 보냈습니다!", {
                            theme: "toasted-primary",
                            icon: 'faCheck',
                            type: 'success',
                            position: "top-right",
                            duration: 3000
                        });
                        this.$store.commit('updateFriends');

                    }).catch((err) => {
                        this.$toasted.show("존재하지 않거나 이미 친구인 이메일 입니다!", {
                            theme: "toasted-primary",
                            type: 'error',
                            position: "top-right",
                            duration: 3000
                        });
                        console.log("Cannot log in" + err);
                        console.log("response::" + JSON.stringify(err.response.data[2].message));
                        this.error = err.response.data[2].message;
                });
            }
        }

    }

</script>


<style scoped>

    form {
        width: 100%;
        max-width: 350px;
        padding: 15px;
        margin: auto;
    }

    #add-friend {
        height: 100%;
    }
</style>