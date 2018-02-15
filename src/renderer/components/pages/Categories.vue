<template>
  <main>
    <v-container fluid>
      <v-layout row
                wrap>

        <v-snackbar :timeout="2000" top right v-model="categoryAddedSnackbar">
          Category Added
        </v-snackbar>

        <v-flex xs4>
          <v-text-field append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                        v-model="search"
                        class="">
          </v-text-field>
        </v-flex>
        <v-flex xs8 class="text-xs-right">
          <add-category-modal @saved="categoryAdded"></add-category-modal>
        </v-flex>

        <v-flex xs12>
          <v-data-table :headers="headers"
                        :items="categories"
                        :rows-per-page-items="pagination.size"
                        :pagination.sync="pagination.sort"
                        :search="search"
                        class="elevation-1">
            <template slot="items"
                      slot-scope="props">
              <td 
                class="text-xs-left">
                {{ props.item.fullName }}
              </td>
              <td class="text-xs-right">
                <span :class=" props.item.subAccountIds == null && props.item.transactionCount === 0 ? 'red--text' : ''">
                  {{ props.item.transactionCount }}
                </span>
              </td>
            </template>
          </v-data-table>
        </v-flex>

      </v-layout>
    </v-container>
  </main>
</template>

<script>
import AddCategoryModal from './Categories/AddCategoryModal'
import * as _ from 'lodash'

export default {
  name: 'categories',
  components: { AddCategoryModal },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'fullName', align: 'left' },
        { text: 'Transaction Count', value: 'transactionCount', align: 'right' }
      ],
      pagination: {
        size: [12, 25, 50, 100],
        sort: {
          sortBy: 'fullName',
          descending: false
        }
      },
      search: '',
      addedCategory: null,
      categoryAddedSnackbar: false
    }
  },
  computed: {
    categories() {
      // we rely on 'addedCategory' to be sure that the page gets refreshed
      if (this.addedCategory) {
        this.categoryAddedSnackbar = true
        this.addedCategory = null
      }
      return this.$repo.isLoaded()
        ? _.chain(this.$repo.categories())
            .map(c =>
              Object.assign({}, c, {
                fullName: this.$format.categoryFullName(c.id),
                transactionCount: this.$repo.transactionsForCategory(c.id).length
              })
            )
            .value()
        : []
    }
  },
  methods: {
    categoryAdded(newCategory) {
      this.addedCategory = newCategory
      // let's use the search to focus on the new category
      this.search = newCategory.name
    }
  }
}
</script>

<style>

</style>
