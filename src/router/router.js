import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const VueRouter = new Router({
  routes: [
    {
      path: '/generator',
      name: 'generator',
      component: require('@/views/Generator').default
    },
    {
      path: '*',
      redirect: '/generator'
    }
  ]
})

export default VueRouter
