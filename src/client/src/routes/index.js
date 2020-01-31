import Vue from 'vue'
import Router from 'vue-router'
import Users from '@/components/UsersPage'
import Index from '@/components/IndexPage'
import Login from '@/components/account/LoginPage'
import Register from '@/components/account/RegisterPage'

Vue.use(Router)

export const router = new Router({
 mode: 'history',
 base: process.env.BASE_URL,
 routes: [
    {
        path: '/',
        name: 'index',
        component: Index
    },
    {
        path: '/users',
        name: 'users',
        component: Users
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    }
 ]
})