import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import About from '@/views/About.vue'
import Settings from '@/views/Settings.vue'
import Game from '@/views/Game.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/setting',
      name: 'settings',
      component: Settings
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    }
  ]
})
