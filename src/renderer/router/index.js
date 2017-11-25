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
          path: 'institutions',
          component: require('@/components/pages/Institutions')
        },
        {
          path: 'payees',
          component: require('@/components/pages/Payees')
        },
        {
          path: 'payeefinders',
          component: require('@/components/pages/PayeeFinders')
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
