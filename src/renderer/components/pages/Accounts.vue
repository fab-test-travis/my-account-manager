<template>
  <main>
    <v-container fluid>
      <v-layout row
                wrap>
        <v-flex xs3>
          <v-select :disabled="!this.$repo.isLoaded()"
                    :items="accounts"
                    v-model="selectedAccount"
                    label="Select account"
                    item-text="name"
                    item-value="id">
          </v-select>
        </v-flex>

        <v-flex xs5>
        </v-flex>

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
                      :items="transactions"
                      :rows-per-page-items="pagination.size"
                      :pagination.sync="pagination.sort"
                      :search="search">
          <template slot="items"
                    scope="props">
            <td class="text-xs-left" v-tooltip:top="{ html: props.item.id }">
              <div style="font-weight: bold; font-size: 16px">{{ $format.dateInYear(props.item.date) }}</div>
              <div>{{ $format.year(props.item.date) }}</div>
            </td>
            <td class="text-xs-left">
              <div v-tooltip:left="{ html: props.item.payeeId }">{{ $format.payeeName(props.item.payeeId) }}</div>
              <div>{{ props.item.desc }}</div>
            </td>
            <td class="text-xs-center">
              <div v-tooltip:top="{ html: props.item.fromId }">{{ $format.categoryName(props.item.fromId) }}</div>
            </td>
            <td class="text-xs-right"
                :class="$format.colorForAmount(props.item.amount)">
              {{ $format.amount(props.item.amount) }}
            </td>
          </template>
        </v-data-table>

      </v-layout>
    </v-container>
  </main>
</template>

<script>
export default {
  name: 'accounts',
  props: ['accountId'],
  data() {
    return {
      selectedAccount: this.accountId ? this.accountId : null,
      headers: [
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Description', value: 'description', sortable: false, align: 'left' },
        { text: 'Category', value: 'category', sortable: false, align: 'center' },
        { text: 'Amount', value: 'amount', sortable: false, align: 'right' }
      ],
      pagination: {
        size: [25, 50, 100],
        sort: {
          sortBy: 'date',
          descending: true
        }
      },
      search: ''
    }
  },
  computed: {
    accounts() {
      return this.$repo.isLoaded() ? this.$repo.bankAccounts() : []
    },
    transactions() {
      return this.$repo.isLoaded() && this.selectedAccount != null ? this.$repo.transactionsForAccount(this.selectedAccount) : []
    }
  }
}

</script>

<style>

</style>
