<template>
  <main>
    <v-container fluid>
      <v-layout row
                wrap>

        <v-flex xs6>
          <v-switch label="Favorites Only"
                    v-model="favoritesOnly"
                    color="blue darken-1">
          </v-switch>
          <v-list two-line dense>
            <template v-for="(item, index) in accounts">
              <v-divider v-if="index > 0"
                         :inset="true"
                         :key="index"></v-divider>
              <v-list-tile avatar
                           :key="item.id"
                           :to="'/accounts/' + item.id">
                <v-list-tile-avatar>
                  <img :src="$format.institutionIcon(item.institutionId)">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.accountNumber"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>
                    {{ $format.amount($repo.getAccountBalance(item.id)) }} &euro;
                  </v-list-tile-action-text>
                  <v-icon class="grey--text text--lighten-1">{{ item.favorite ? 'star' : 'star_border' }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>

      </v-layout>
    </v-container>
  </main>
</template>

<script>
import * as _ from 'lodash'

export default {
  name: 'dashboard',
  data() {
    return {
      items: this.$repo.isLoaded() ? this.$repo.bankAccounts() : [],
      favoritesOnly: true
    }
  },
  computed: {
    accounts() {
      return this.$repo.isLoaded()
        ? _.chain(this.$repo.bankAccounts(this.showClosed))
            .filter(a => (this.favoritesOnly ? a.favorite : true))
            .value()
        : []
    }
  }
}

</script>

<style>

</style>
