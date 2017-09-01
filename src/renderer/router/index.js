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
          component: require('@/components/pages/Dashboard')
        },
        {
          path: 'dashboards',
          component: require('@/components/pages/Dashboard')
        },
        {
          path: 'accounts',
          component: require('@/components/pages/Accounts')
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
