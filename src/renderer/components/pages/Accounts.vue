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
            <td class="text-xs-right">{{ props.item.date }}</td>
            <td class="text-xs-right"
                :class="$format.colorForAmount(props.item.amount)">{{ $format.amount(props.item.amount) }}</td>
            <td class="text-xs-right">{{ props.item.fromId }}</td>
            <td class="text-xs-right">{{ props.item.toId }}</td>
            <td class="text-xs-right">{{ props.item.payeeId }}</td>
            <td class="text-xs-right">{{ props.item.desc }}</td>
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
        { text: 'Date', value: 'date', align: 'left' },
        { text: 'Amount', value: 'amount' },
        { text: 'From', value: 'fromId' },
        { text: 'To', value: 'toId' },
        { text: 'Payee', value: 'payeeId' },
        { text: 'Description', value: 'desc' }
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
