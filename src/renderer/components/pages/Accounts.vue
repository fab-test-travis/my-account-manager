<template>
  <main>
    <v-container fluid>
      <v-layout row
                wrap>
        <v-flex xs5
                class="pr-4">
          <v-select :disabled="!this.$repo.isLoaded()"
                    :items="accounts"
                    v-model="selectedAccount"
                    label="Select account"
                    item-text="name"
                    item-value="id">
          </v-select>
        </v-flex>
        <v-flex xs2>
          <v-switch
              label="Show closed"
              v-model="showClosed"
            ></v-switch>
        </v-flex>
        <v-flex xs5></v-flex>

        <v-flex xs3
                v-if="selectedAccount != null"
                class="pr-5">
          <div>
            <div class="pb-4">
              <v-avatar size="64px">
                <img :src="$format.institutionIcon($repo.bankAccount(selectedAccount).institutionId)">
              </v-avatar>
            </div>
            <div class="grey--text text--darken-1">
              Balance
            </div>
            <div class="text-xs-right headline">
              {{ $format.amount(accountBalance) }} &euro;
            </div>
            <div class="grey--text text--darken-1">
              Account number
            </div>
            <div class="text-xs-right headline">
              {{ $repo.bankAccount(selectedAccount).accountNumber }}
            </div>
          </div>
          <div class="mt-5">
            <v-text-field append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                          v-model="search"
                          class="">
            </v-text-field>
          </div>
        </v-flex>

        <v-flex xs9
                v-if="selectedAccount != null">

          <v-data-table :headers="headers"
                        :items="transactions"
                        :rows-per-page-items="pagination.size"
                        :pagination.sync="pagination.sort"
                        :search="search">
            <template slot="items"
                      scope="props">
              <td class="text-xs-left"
                  v-tooltip:top="{ html: props.item.id }">
                <div style="font-weight: bold; font-size: 16px">{{ $format.dateInYear(props.item.date) }}</div>
                <div>{{ $format.year(props.item.date) }}</div>
              </td>
              <td class="text-xs-left">
                <div v-if="$repo.bankAccount(props.item.toId) != null && $repo.bankAccount(props.item.fromId) != null">
                  Virement {{ selectedAccount === props.item.fromId ? 'depuis' : 'vers' }} {{ selectedAccount === props.item.fromId ? $format.categoryName(props.item.toId) : $format.categoryName(props.item.fromId) }}
                </div>
                <div v-tooltip:left="{ html: props.item.payeeId }">{{ $format.payeeName(props.item.payeeId) }}</div>
                <div>{{ props.item.desc }}</div>
              </td>
              <td v-if="$repo.bankAccount(props.item.toId) != null && $repo.bankAccount(props.item.fromId) != null"
                  class="text-xs-center">
                Virement
              </td>
              <td v-else
                  class="text-xs-center">
                <div v-tooltip:top="{ html: props.item.fromId }">{{ $format.categoryName(props.item.fromId) }}</div>
              </td>
              <td class="text-xs-right"
                  :class="$format.colorForAmount(selectedAccount === props.item.toId ? props.item.amount : -props.item.amount)">
                {{ $format.amount(selectedAccount === props.item.toId ? props.item.amount : -props.item.amount) }}
              </td>
            </template>
          </v-data-table>
        </v-flex>

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
        size: [12, 25, 50, 100],
        sort: {
          sortBy: 'date',
          descending: true
        }
      },
      showClosed: false,
      search: ''
    }
  },
  computed: {
    accounts() {
      return this.$repo.isLoaded() ? this.$repo.bankAccounts(this.showClosed) : []
    },
    transactions() {
      return this.$repo.isLoaded() && this.selectedAccount != null ? this.$repo.transactionsForAccount(this.selectedAccount) : []
    },
    accountBalance() {
      return this.$repo.isLoaded() && this.selectedAccount != null ? this.$repo.getAccountBalance(this.selectedAccount) : ''
    }
  }
}

</script>

<style>

</style>
