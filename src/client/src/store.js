import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loggedin : false,
        user : undefined
    },
    mutations: {
        updateUser(state){
            axios.get('/auth/user')
                .then((res) => {
                    if (res.data.user !== undefined) {
                        state.loggedin = true;
                        state.user = res.data.user;
                    }else{
                        state.loggedin = false;
                        state.user = undefined;
                    }
                }).catch((err) => {
                console.log(err);
            });
        }

    }

})