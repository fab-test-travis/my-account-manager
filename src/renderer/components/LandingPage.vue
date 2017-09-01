<template>
  <v-app dark>
    <nav-bar></nav-bar>

    <v-toolbar fixed
               class="blue darken-1">
      <v-toolbar-title>
        <v-btn class="grey darken-3"
               :loading="loading"
               @click.native="loader = 'loading'"
               :disabled="loading">
          Load
          <v-icon right>file_upload</v-icon>
        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon>help</v-icon>

    </v-toolbar>

    <router-view></router-view>
  </v-app>
</template>

<script>
import NavBar from './LandingPage/NavBar'

export default {
  name: 'landing-page',
  components: { NavBar },
  data() {
    return {
      loader: null,
      loading: false
    }
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      this.$storage.loadFromJson('', (err, obj) => {
        if (err) {
          console.error(err)
        }
        this[l] = false
        this.loader = null
      })
    }
  }
}

</script>

<style>

</style>
