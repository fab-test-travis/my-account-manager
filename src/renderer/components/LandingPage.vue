<template>

  <v-app dark>

     <v-navigation-drawer
      class="pb-0"
      persistent
      clipped
      v-model="drawer"
    >
      <v-list dense>
        <v-select
          v-if="repository"
          :items="accounts"
          v-model="selectedAccount"
          label="Select account"
          item-text="name"
          item-value="accountNumber"
        ></v-select>
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
        <v-btn
          :loading="loading"
          @click.native="loader = 'loading'"
          :disabled="loading"
        >
          Load
          <v-icon right>file_upload</v-icon>
        </v-btn>
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
          <v-list v-if="repository" two-line>
            <template v-for="account in repository.bankAccounts">
              <v-list-tile :key="account.accountNumber">
                <v-list-tile-content>
                  <v-list-tile-title v-html="account.accountNumber"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="account.name"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
      </v-container>
    </main>

    <v-footer></v-footer>

  </v-app>

</template>

<script>
  import * as _ from 'lodash'
  import StorageService from '../services/StorageService'

  const storageService = new StorageService()

  export default {
    name: 'landing-page',
    data () {
      return {
        drawer: true,
        mini: false,
        loader: null,
        loading: false,
        items: [
          { icon: 'trending_up', text: 'Dashboard' },
          { icon: 'system_update', text: 'Update Accounts' },
          { icon: 'settings', text: 'Settings' }
        ],
        repository: null,
        selectedAccount: null
      }
    },
    computed: {
      accounts () {
        return _.values(this.repository.bankAccounts)
      }
    },
    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        storageService.loadFromJson('', (err, obj) => {
          if (err) {
            console.error(err)
          } else {
            this.repository = storageService.repo
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
