<template>
  <v-dialog v-model="open" persistent width="50%">
    <v-card v-if="this.transaction !== null">
      <v-card-title>
        <div>
          <span class="headline">Edit Transaction</span>
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
          <v-switch label="Bank Transfer" v-model="isBankTransfer"></v-switch>
        </div>
      </v-card-title>
      <v-card-text v-if="isBankTransfer">
        <v-select
          :label="($format.transactionAmount(this.transaction, this.account) > 0 ? 'From ' : 'To ') + ' Bank Account'"
          :items="$repo.bankAccounts()"
          item-text="name"
          item-value="id"
          v-model="categoryId"
          autocomplete
          required>
        </v-select>
        <v-text-field
          label="Description"
          textarea
          rows="3"
          v-model="description">
        </v-text-field>
      </v-card-text>
      <v-card-text v-else>
        <v-select
          label="Payee"
          :items="$repo.payees()"
          item-text="name"
          item-value="id"
          v-model="payeeId"
          autocomplete
          autofocus>
        </v-select>
        <v-select
          label="Category"
          :items="$repo.categories()"
          item-text="name"
          item-value="id"
          v-model="categoryId"
          autocomplete
          required>
        </v-select>
        <v-text-field
          label="Description"
          textarea
          rows="3"
          v-model="description">
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
  name: 'edit-transaction-modal',
  props: ['open', 'transaction', 'account'],
  data() {
    return {
      payeeId: '',
      categoryId: '',
      description: '',
      isBankTransfer: false
    }
  },
  methods: {
    close() {
      this.$emit('closed')
    },
    updateTransaction() {
      this.transaction.payeeId = this.payeeId
      this.transaction.fromId = this.categoryId
      this.transaction.desc = this.description
      this.$emit('saved')
    }
  },
  watch: {
    transaction: function(newTransaction) {
      if (newTransaction) {
        this.isBankTransfer = this.$format.isTransfer(newTransaction)
        this.categoryId = newTransaction.fromId
        this.description = newTransaction.desc
        if (this.isBankTransfer) {
          this.payeeId = ''
        } else {
          this.payeeId = newTransaction.payeeId
        }
      }
    },
    isBankTransfer: function(isTransfer) {
      if (isTransfer) {
        this.payeeId = ''
      }
    }
  }
}
</script>

<style>

</style>
