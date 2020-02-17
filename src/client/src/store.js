import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

let grade = ["오랑캐", "백정", "평민", "선비", "학자", "세종"];
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loggedin: false,
        user: undefined,
        user_img: null,
        countChat: 0,
        countReq: 0,
        rooms: undefined,
        friends: undefined
    },
    mutations: {
        updateUser(state) {
            axios.get('/auth/user')
                .then((res) => {
                    if (res.data.user !== undefined) {
                        state.loggedin = true;
                        state.user = res.data.user;
                        state.user_img = res.data.user.image_path;

                        let grade_num = res.data.user.grade;
                        state.user.grade = grade[grade_num - 1];
                        this.commit('updateFriends',this.commit('updateRoom'));
                        if (grade_num === 1) {
                            state.user_img = "http://localhost:3000/images/orangke.png";
                        }
                    } else {
                        state.loggedin = false;
                        state.user = undefined;
                    }
                }).catch((err) => {
                console.log(err);

            });
        },
        updateRoom(state) {
            if (!state.loggedin || typeof state.user == "undefined") return;
            axios.get(`/api/room/${state.user.id}`)
                .then((res) => {
                    state.rooms = res.data;
                    state.countChat = state.rooms[state.rooms.length - 1];
                    state.rooms.splice(state.rooms.length - 1, 1);
                }).catch((err) => {
                console.log('Room: ', err);
            });

        },
        updateReq(state) {
            axios.get('/auth/friend/request/cnt')
                .then((res) => {
                    console.log("req cnt:", res.data['COUNT(*)']);
                    state.countReq = res.data['COUNT(*)'];
                }).catch((err) => {
                console.log('req: ', err);
            })
        },
        updateFriends(state, callback) {
            axios.get('/auth/friend')
                .then((res) => {
                    state.friends = res.data;
                    if (callback) callback();
                }).catch((err) => {
                console.log(err);
            });
        }
    },
    getters: {
        getUser: state => () => state.user.id,
        getUserInfo: state => () => state.user,
        getUserImg: state => () => state.user_img,
        getUserLogin: state => () => state.loggedin,
        getUnread: state => () => state.countChat,
        getReq: state => () => state.countReq,
        getFriends: state => () => state.friends
    }

})