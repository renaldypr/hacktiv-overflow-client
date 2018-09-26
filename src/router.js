import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

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
      path: '/questions',
      name: 'questions',
      component: () => import('./views/Questions.vue')
    },
    {
      path: '/questions/:id',
      name: 'details',
      props: true,
      component: () => import('./views/QuestionDetail.vue')
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('./views/QuestionForm.vue')
    },
    {
      path: '/edit/:id',
      name: 'edit',
      props: true,
      component: () => import('./views/QuestionEdit.vue')
    }
  ]
})
