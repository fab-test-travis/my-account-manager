<template>
  <main>
    <v-container fluid>
      <v-layout row
                wrap>
        <v-flex xs8>
          <v-select :disabled="!this.$repo.isLoaded()"
                    :items="accounts"
                    v-model="selectedAccount"
                    label="Select account"
                    item-text="name"
                    item-value="id">
          </v-select>
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
                      :search="search"
                      class="elevation-1">
          <template slot="items"
                    scope="props">
            <td class="text-xs-left">{{ props.item.date }}</td>
            <td class="text-xs-right">{{ props.item.fromId }}</td>
            <td class="text-xs-right">{{ props.item.payeeId }}</td>
            <td class="text-xs-right">{{ props.item.desc }}</td>
            <td class="text-xs-right"
                :class="$format.colorForAmount(props.item.amount)">{{ $format.amount(props.item.amount) }}</td>
          </template>
        </v-data-table>

      </v-layout>
    </v-container>
  </main>
</template>

<script>
export default {
  name: 'page-accounts',
  props: ['accountId'],
  data() {
    return {
      selectedAccount: this.accountId ? this.accountId : null,
      headers: [
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'From', value: 'fromId', sortable: false },
        { text: 'Payee', value: 'payeeId', sortable: false },
        { text: 'Description', value: 'desc', sortable: false },
        { text: 'Amount', value: 'amount', sortable: false }
      ],
      pagination: {
        size: [25, 50, 100],
        sort: {
          sortBy: 'date',
          descending: true
        }
      },
      search: '',
      items: this.selectedAccount ? this.$repo.bankAccounts() : []
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
