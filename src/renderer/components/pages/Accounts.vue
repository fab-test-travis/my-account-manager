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
          <v-switch label="Favorites Only"
                    v-model="favoritesOnly"></v-switch>
        </v-flex>
        <v-flex xs2>
          <v-switch label="Show closed"
                    v-model="showClosed"></v-switch>
        </v-flex>
        <v-flex xs1></v-flex>

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
            <div class="text-xs-right">
              {{ $repo.bankAccount(selectedAccount).accountNumber }}
            </div>
          </div>
          <div>
            <v-btn icon class="cyan--text text--accent-1">
              <v-icon>{{ $repo.bankAccount(selectedAccount).favorite ? 'star' : 'star_border' }}</v-icon>
            </v-btn>
            <v-dialog v-model="syncModal" persistent width="50%">
              <v-btn icon class="cyan--text text--accent-1" slot="activator">
                <v-icon>sync</v-icon>
              </v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">Synchronize account with transactions</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field 
                    name="transactionsInput"
                    v-model="transactionsInput"
                    label="Transactions"
                    textarea
                    rows="15"
                    autofocus>
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="blue--text darken-1" flat @click.native="syncModal = false">Close</v-btn>
                  <v-btn class="blue--text darken-1" flat @click.native="synchronizeWithTransactions()">Synchronize</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
                <div style="font-weight: bold; font-size: 16px; white-space: nowrap">{{ $format.dateInYear(props.item.date) }}</div>
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
import * as _ from 'lodash'

export default {
  name: 'accounts',
  props: ['accountId'],
  data() {
    return {
      selectedAccount: this.accountId ? this.accountId : null,
      headers: [
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        {
          text: 'Description',
          value: 'description',
          sortable: false,
          align: 'left'
        },
        {
          text: 'Category',
          value: 'category',
          sortable: false,
          align: 'center'
        },
        { text: 'Amount', value: 'amount', sortable: false, align: 'right' }
      ],
      pagination: {
        size: [12, 25, 50, 100],
        sort: {
          sortBy: 'date',
          descending: true
        }
      },
      favoritesOnly: true,
      showClosed: false,
      search: '',
      syncModal: false,
      transactionsInput: '',
      transactions: this.retrieveTransactions(),
      accountBalance: this.computeAccountBalance()
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
  },
  watch: {
    selectedAccount: function(newAccount) {
      this.transactions = this.retrieveTransactions()
      this.accountBalance = this.computeAccountBalance()
    }
  },
  methods: {
    retrieveTransactions() {
      return this.getAccountId() != null
        ? this.$repo.transactionsForAccount(this.getAccountId())
        : []
    },
    computeAccountBalance() {
      return this.getAccountId() != null
        ? this.$repo.getAccountBalance(this.getAccountId())
        : ''
    },
    getAccountId() {
      return (this.selectedAccount == null) ? this.accountId : this.selectedAccount
    },
    synchronizeWithTransactions() {
      this.$cvsLoader.extractTransactions(
        this.transactionsInput,
        (transactions, err) => {
          this.syncModal = false
          if (err) {
            // TODO Do some better error handling here
            console.error(err)
          } else {
            this.$repo.synchronizeTransactions(this.selectedAccount, transactions)
            this.transactions = this.retrieveTransactions()
            this.accountBalance = this.computeAccountBalance()
          }
          this.transactionsInput = ''
        }
      )
    }
  }
}
</script>

<style>

</style>
