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
        </div>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs11>
            <v-select
              label="Payee"
              :items="$repo.payees()"
              item-text="name"
              item-value="id"
              v-model="payeeId"
              autocomplete
              autofocus
              v-if="!showNewPayeeField">
            </v-select>
            <v-text-field
              label="New Payee"
              v-model="newPayeeName"
              v-if="showNewPayeeField">
            </v-text-field>
          </v-flex>
          <v-flex xs1>
            <v-btn icon class="blue--text darken-1 mt-3" @click="adaptPayeeField">
              <v-icon>compare_arrows</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12>
            <v-select
              label="Category"
              :items="$repo.categories()"
              item-text="name"
              item-value="id"
              v-model="categoryId"
              :hint="$format.categoryFullName(this.categoryId)"
              persistent-hint
              autocomplete
              required>
            </v-select>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Description"
              textarea
              rows="3"
              v-model="description">
            </v-text-field>
          </v-flex>
        </v-layout>
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
      showNewPayeeField: false,
      newPayeeName: ''
    }
  },
  methods: {
    close() {
      this.$emit('closed')
    },
    updateTransaction() {
      if (this.newPayeeName) {
        let newPayee = this.$repo.addPayee(this.newPayeeName)
        this.transaction.payeeId = newPayee.id
      } else {
        this.transaction.payeeId = this.payeeId
      }
      this.transaction.fromId = this.categoryId
      this.transaction.desc = this.description
      this.$emit('saved')
    },
    adaptPayeeField() {
      this.showNewPayeeField = !this.showNewPayeeField
      if (!this.showNewPayeeField) {
        this.newPayeeName = ''
      }
    }
  },
  watch: {
    transaction: function(newTransaction) {
      if (newTransaction) {
        this.categoryId = newTransaction.fromId
        this.description = newTransaction.desc
        this.payeeId = newTransaction.payeeId
        this.showNewPayeeField = false
        this.newPayeeName = ''
      }
    }
  }
}
</script>

<style>

</style>
