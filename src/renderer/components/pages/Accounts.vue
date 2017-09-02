<template>
  <main>
    <v-container fluid>
      <v-select :disabled="!this.$repo.isLoaded()"
                :items="accounts"
                v-model="selectedAccount"
                label="Select account"
                item-text="name"
                item-value="id">
      </v-select>

      <v-list v-if="selectedAccount"
              two-line>
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
</template>

<script>
import * as _ from 'lodash'

export default {
  name: 'page-accounts',
  data() {
    return {
      selectedAccount: null
    }
  },
  computed: {
    accounts() {
      return this.$repo.isLoaded() ? _.values(this.$repo.bankAccounts()) : []
    },
    transactions() {
      if (this.selectedAccount == null) {
        return []
      }
      let tList = []
      // couldn't manage to use lodash here... :-(
      _.values(this.$repo.transactions()).forEach(t => {
        if (this.selectedAccount === t.fromId || this.selectedAccount === t.toId) {
          tList.push(t)
        }
      })
      return tList
    }
  }
}

</script>

<style>

</style>
