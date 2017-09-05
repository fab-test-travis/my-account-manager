import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/components/MainPage'),
      children: [
        {
          path: '/',
          component: require('@/components/pages/Welcome')
        },
        {
          path: 'dashboards',
          component: require('@/components/pages/Dashboard')
        },
        {
          path: 'accounts/:accountId',
          component: require('@/components/pages/Accounts'),
          props: true
        },
        {
          path: 'accounts',
          component: require('@/components/pages/Accounts'),
          props: true
        },
        {
          path: 'categories',
          component: require('@/components/pages/Categories')
        },
        {
          path: 'settings',
          component: require('@/components/pages/Settings')
        }
      ]
    },
    // And the default routes
    {
      path: '*',
      redirect: '/'
    }
  ]
})
