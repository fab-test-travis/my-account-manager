<template>
  <v-app dark>
    <nav-bar></nav-bar>

    <v-toolbar fixed
               class="blue darken-1">
      <v-toolbar-title>
        My Account Manager
        <v-icon>monetization_on</v-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon
             to="/">
        <v-icon>home</v-icon>
      </v-btn>
      <v-icon>help</v-icon>

    </v-toolbar>

    <router-view></router-view>
  </v-app>
</template>

<script>
import NavBar from './NavBar'

export default {
  name: 'landing-page',
  components: { NavBar }
}

</script>

<style>

</style>
