<template>
  <main>
    <v-container fluid>
      <v-layout row
                wrap>

        <v-flex xs4>
          <v-text-field append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                        v-model="search"
                        class="">
          </v-text-field>
        </v-flex>

        <v-data-table :headers="headers"
                      :items="categories"
                      :rows-per-page-items="pagination.size"
                      :pagination.sync="pagination.sort"
                      :search="search"
                      class="elevation-1">
          <template slot="items"
                    scope="props">
            <td 
              class="text-xs-left"
              v-tooltip:top="{ html: props.item.id }">
              {{ props.item.fullName }}
            </td>
          </template>
        </v-data-table>

      </v-layout>
    </v-container>
  </main>
</template>

<script>
import * as _ from 'lodash'

export default {
  name: 'categories',
  data() {
    return {
      headers: [{ text: 'Name', value: 'fullName', align: 'left' }],
      pagination: {
        size: [12, 25, 50, 100],
        sort: {
          sortBy: 'fullName',
          descending: false
        }
      },
      search: ''
    }
  },
  computed: {
    categories() {
      return this.$repo.isLoaded()
        ? _.chain(this.$repo.categories())
            .map(c => Object.assign({}, c, { fullName: this.$format.categoryFullName(c.id) }))
            .value()
        : []
    }
  }
}
</script>

<style>

</style>
