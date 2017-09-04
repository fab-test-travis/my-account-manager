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
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.date }}</td>
            <td class="text-xs-right">{{ props.item.amount }}</td>
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
        {
          text: 'Transaction ID',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Date', value: 'date' },
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
      if (this.selectedAccount == null) {
        return []
      }
      let tList = []
      // couldn't manage to use lodash here... :-(
      this.$repo.transactions().forEach(t => {
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
