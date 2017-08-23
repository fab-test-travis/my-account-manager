<template>

  <v-app id="example-8" dark toolbar>
    <v-navigation-drawer
      persistent
      v-model="drawer" 
      :mini-variant="mini" 
      dark 
      overflow
      absolute
    >
      <v-list class="pa-1">
        <v-list-tile v-if="mini" @click.native.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon light>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img src="https://secure.gravatar.com/avatar/3bee1367bdf28d58f7c4527f6a84ca33.jpg" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Fabrice</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.native.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider light></v-divider>
        <v-list-tile v-for="item in items" :key="item.title">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Toolbar</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex xs6 offset-xs3>
            <v-card>
              <img v-bind:src="imageUrl"/>
              {{ accountContent }}
            </v-card>
          </v-flex>
        </v-layout>
        <!--v-router-->
      </v-container>
    </main>
  </v-app>

</template>

<script>
  import { remote } from 'electron'
  import path from 'path'
  import * as jsonfile from 'jsonfile'

  let homeDir = remote.app.getPath('home')
  let accountStorage = path.join(homeDir, 'Repos/_PERSO_/_resources_/some-tests/Comptes.json')

  export default {
    data () {
      return {
        drawer: null,
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ],
        mini: false,
        right: null,
        imageUrl: 'static/images/electron.png',
        accountContent: jsonfile.readFileSync(accountStorage)
      }
    }
  }
</script>

<style>
</style>
