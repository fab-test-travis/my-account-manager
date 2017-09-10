import Vue from 'vue'
import MainPage from '@/components/MainPage'

describe('MainPage.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(MainPage)
    }).$mount()

    expect(vm.$el.querySelector('.toolbar__title').textContent).to.contain('My Account Manager')
  })
})
