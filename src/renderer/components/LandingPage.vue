<template>
  <v-app dark>

    <v-navigation-drawer
      permanent
      :mini-variant.sync="mini"
    >
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

      <v-toolbar
        fixed
        class="blue darken-1"
      >
        <v-toolbar-title>
          <v-toolbar-side-icon @click.stop="mini = !mini"></v-toolbar-side-icon>
          <v-btn
            class="grey darken-3"
            :loading="loading"
            @click.native="loader = 'loading'"
            :disabled="loading"
          >
            Load
            <v-icon right>file_upload</v-icon>
            </v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>help</v-icon>
        </v-toolbar>

        <main>
          <v-container fluid>
            <v-select
              :disabled="repository == null"
              :items="accounts"
              v-model="selectedAccount"
              label="Select account"
              item-text="name"
              item-value="id"
            ></v-select>
              <v-list
                v-if="selectedAccount"
                two-line
              >
                <template v-for="transaction in transactions">
                  <v-list-tile :key="transaction.id">
                    <v-list-tile-content>
                      <v-list-tile-title v-html="transaction.amount"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="transaction.date"></v-list-tile-sub-title>
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
      mini: false,
      loader: null,
      loading: false,
      repository: null,
      selectedAccount: null,
      manageItems: [
        { icon: 'attach_money', text: 'Accounts' },
        { icon: 'group_work', text: 'Categories' },
        { icon: 'account_balance', text: 'Institutions' },
        { icon: 'people', text: 'Payees' }
      ]
    }
  },
  computed: {
    accounts () {
      return this.repository ? _.values(this.repository.bankAccounts) : []
    },
    transactions () {
      if (this.selectedAccount == null) {
        return []
      }
      let tList = []
      // couldn't manage to use lodash here... :-(
      _.values(this.repository.transactions).forEach(t => {
        if (this.selectedAccount === t.fromId || this.selectedAccount === t.toId) {
          tList.push(t)
        }
      })
      return tList
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
