import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
let grade = ["오랑캐", "백정", "평민", "선비", "학자", "세종"];
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loggedin : false,
        user : undefined,
        user_img : null,
    },
    mutations: {
        updateUser(state){
            axios.get('/auth/user')
                .then((res) => {
                    if (res.data.user !== undefined) {
                        state.loggedin = true;
                        state.user = res.data.user;
                        state.user_img = res.data.user.image_path;

                        let grade_num = res.data.user.grade;
                        state.user.grade = grade[grade_num-1];

                        if(grade_num === 1){
                            state.user_img = "http://localhost:3000/images/orangke.png";
                            console.log("hi");
                        }
                    }else{
                        state.loggedin = false;
                        state.user = undefined;
                    }
                }).catch((err) => {
                console.log(err);

            });
        },

    },
    getters: {
        getUser: state => () => state.user.id,
        getUserInfo: state => () => state.user,
        getUserImg: state => () => state.user_img
    }

})