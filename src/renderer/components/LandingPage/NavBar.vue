<template>
  <v-navigation-drawer
    permanent
    :mini-variant.sync="mini"
  >

    <div :class="miniIconStyle">
      <v-toolbar-side-icon @click.stop="mini = !mini">
      </v-toolbar-side-icon>
    </div>

    <div class="pa-3 mt-3 mb-3">
      <v-toolbar-title>
        My Account Manager
        <v-icon>monetization_on</v-icon>
      </v-toolbar-title>
      <div class="text-xs-center">Version x.x</div>
    </div>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>dashboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Dashboards
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-subheader class="mt-2 grey--text text--darken-1">MANAGE</v-subheader>
    <v-list dense>
      <v-list-tile
        v-for="item in manageItems"
        :key="item.text"
      >
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

    <v-subheader class="mt-2 grey--text text--darken-1">ADMIN</v-subheader>
    <v-list dense>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>settings</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Settings
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    </v-navigation-drawer>
</template>

<script>

export default {
  name: 'nav-bar',
  data () {
    return {
      mini: false,
      manageItems: [
        { icon: 'attach_money', text: 'Accounts' },
        { icon: 'group_work', text: 'Categories' },
        { icon: 'account_balance', text: 'Institutions' },
        { icon: 'people', text: 'Payees' }
      ]
    }
  },
  computed: {
    miniIconStyle () {
      return this.mini ? 'text-xs-center' : ''
    }
  }
}

</script>

<style>

</style>
