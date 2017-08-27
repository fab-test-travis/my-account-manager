<template>

  <v-app dark>

     <v-navigation-drawer
      class="pb-0"
      persistent
      clipped
      v-model="drawer"
    >
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.text">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }} 
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    
    <v-toolbar class="blue darken-4">
      <v-toolbar-title>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-icon>file_upload</v-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>My Account Manager -</v-toolbar-title>
      <v-icon>monetization_on</v-icon>
    </v-toolbar>

    <main>
      <v-container fluid>
          <div>
            Hello world!
          </div>
      </v-container>
    </main>

    <v-footer></v-footer>

  </v-app>

</template>

<script>

  export default {
    name: 'landing-page',
    data () {
      return {
        drawer: true,
        mini: false,
        items: [
          { icon: 'trending_up', text: 'Dashboard' },
          { icon: 'system_update', text: 'Update Accounts' },
          { icon: 'settings', text: 'Settings' }
        ]
      }
    }
  }

</script>

<style>
</style>
