import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/components/LandingPage'),
      children: [
        {
          path: '/',
          component: require('@/components/LandingPage/PageDashboard')
        },
        {
          path: 'dashboards',
          component: require('@/components/LandingPage/PageDashboard')
        },
        {
          path: 'accounts',
          component: require('@/components/LandingPage/PageAccounts')
        },
        {
          path: 'settings',
          component: require('@/components/LandingPage/PageSettings')
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
