import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage')
    },
    // All following is for test purposes (previous lines must be documented to have access to this)
    {
      path: '/',
      name: 'testing',
      component: require('@/components/testing/Testing')
    },
    {
      path: '/initial-landing-page',
      name: 'initial-landing-page',
      component: require('@/components/testing/InitialLandingPage')
    },
    {
      path: '/vuetify-tests',
      name: 'vuetify-tests',
      component: require('@/components/testing/VuetifyTests')
    },
    // And the default routes
    {
      path: '*',
      redirect: '/'
    }
  ]
})
