import Vue from 'vue'
import Router from 'vue-router'
import Users from '@/components/UsersPage'
import Index from '@/components/IndexPage'

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
    }
 ]
})