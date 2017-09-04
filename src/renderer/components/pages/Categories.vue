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
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.parentId }}</td>
            <td class="text-xs-right">{{ props.item.subAccountIds }}</td>
          </template>
        </v-data-table>

      </v-layout>
    </v-container>
  </main>
</template>

<script>
export default {
  name: 'categories',
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'ID', value: 'id' },
        { text: 'Parent', value: 'parentId' },
        { text: 'Sub Accounts', value: 'subAccountIds' }
      ],
      pagination: {
        size: [25, 50, 100],
        sort: {
          sortBy: 'name',
          descending: false
        }
      },
      search: '',
      categories: this.$repo.isLoaded() ? this.$repo.categories() : []
    }
  }
}

</script>

<style>

</style>
