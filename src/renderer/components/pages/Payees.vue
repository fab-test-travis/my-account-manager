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

        <v-flex xs12>
          <v-data-table :headers="headers"
                        :items="payees"
                        :rows-per-page-items="pagination.size"
                        :pagination.sync="pagination.sort"
                        :search="search"
                        class="elevation-1">
            <template slot="items"
                      slot-scope="props">
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.id }}</td>
            </template>
          </v-data-table>
        </v-flex>

      </v-layout>
    </v-container>
  </main>
</template>

<script>
export default {
  name: 'payees',
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name', align: 'left' },
        { text: 'ID', value: 'id' }
      ],
      pagination: {
        size: [12, 25, 50, 100],
        sort: {
          sortBy: 'name',
          descending: false
        }
      },
      search: '',
      payees: this.$repo.isLoaded() ? this.$repo.payees() : []
    }
  }
}

</script>

<style>

</style>
