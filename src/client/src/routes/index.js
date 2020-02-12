import Vue from 'vue'

import Router from 'vue-router'
import Users from '@/components/UsersPage'
import Index from '@/components/IndexPage'

import Login from '@/components/account/LoginPage'
import Register from '@/components/account/RegisterPage'

import RoomList from '@/components/chatting/RoomListPage'
import Room from '@/components/chatting/RoomPage'

import AddFriend from '@/components/friend/AddFriend'
import FriendRequests from '@/components/friend/FriendRequests'

import EditProfile from '@/components/EditProfile'

Vue.use(Router);

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
        },
        {
            path: '/roomlist/:user_id',
            name: 'RoomList',
            component: RoomList
        },
        {
            path: '/room/:user_id/:room_number',
            name: 'Room',
            component: Room
        },
        {
            path: '/friend/add',
            name: 'AddFriend',
            component: AddFriend
        },
        {
            path: '/friend/requests',
            name: 'FriendRequests',
            component: FriendRequests
        },
        {
            path: '/profile/edit',
            name: 'EditProfile',
            component: EditProfile
        }
    ]
});