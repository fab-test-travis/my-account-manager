<template>
  <v-dialog v-model="open" persistent width="50%">
    <v-card v-if="this.transaction !== null">
      <v-card-title>
        <div>
          <span class="headline">Edit Card Payments</span>
          <br/>
          <span>{{ this.transaction.date }}</span>
          <br/>
          Amount: 
          <span :class="$format.colorForAmount($format.transactionAmount(this.transaction, this.account))">
            {{ $format.transactionAmount(this.transaction, this.account) }}
          </span>
          <br/>
          <span 
            v-if="this.transaction.stagedDesc !== null"
            class="grey--text">
            <i>{{ this.transaction.stagedDesc }}</i>
          </span>
        </div>
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
        <v-btn class="blue--text darken-1" flat @click.native="updateTransaction()">Update</v-btn>
        <v-btn class="blue--text darken-1" flat @click.native="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'edit-card-payments-modal',
  props: ['open', 'transaction', 'account'],
  data() {
    return {
      transactionsInput: ''
    }
  },
  methods: {
    close() {
      this.transactionsInput = ''
      this.$emit('closed')
    },
    updateTransaction() {
      // First, sanitize the "bad" CSV that misses semi-colon
      let sanitizedCsv = this.$cvsLoader.addMissingSemiColon(this.transactionsInput)
      // And now proceed with replacements
      this.$cvsLoader.extractTransactions(sanitizedCsv, (transactions, err) => {
        this.syncModal = false
        if (err) {
          // TODO Do some better error handling here
          console.error(err)
          this.close()
        } else {
          // ##########################
          // TODO => MUST check that the sum equals the amount of the transaction
          // ##########################
          this.$repo.synchronizeTransactions(this.account, transactions)
          this.$repo.deleteTransaction(this.transaction)
          this.transactionsInput = ''
          this.$emit('saved')
        }
      })
    }
  }
}
</script>

<style>

</style>
