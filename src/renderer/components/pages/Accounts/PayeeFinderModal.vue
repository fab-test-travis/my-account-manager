<template>
  <v-dialog v-model="pfModal" persistent width="50%">
    <v-btn icon class="cyan--text text--accent-1" slot="activator">
      <v-icon>add_circle_outline</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Add Payee Finder</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Expression"
          v-model="expression"
          required
          autofocus>
        </v-text-field>
        <v-select
          label="Payee"
          :items="this.$repo.payees()"
          item-text="name"
          item-value="id"
          v-model="payeeId"
          autocomplete>
        </v-select>
        <v-select
          label="Category"
          :items="this.$repo.categories()"
          item-text="name"
          item-value="id"
          v-model="categoryId"
          autocomplete
          required>
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="blue--text darken-1" flat @click.native="addPayeeFinder()">Add</v-btn>
        <v-btn class="blue--text darken-1" flat @click.native="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'payee-finder-modal',
  data() {
    return {
      pfModal: false,
      expression: '',
      payeeId: '',
      categoryId: '',
      valid: true
    }
  },
  methods: {
    close() {
      this.pfModal = false
      this.expression = ''
      this.payeeId = ''
      this.categoryId = ''
    },
    addPayeeFinder() {
      // Payee can be empty, but not the other fields
      if (
        this.expression !== '' &&
        this.categoryId !== ''
      ) {
        this.$payeeFinder.addFinder({
          payee: this.payeeId,
          expr: this.expression,
          cat: this.categoryId
        })
        this.close()
      }
    }
  },
  watch: {
    pfModal: function(newPfModal) {
      if (newPfModal === true) {
        this.expression = window.getSelection().toString()
      }
    }
  }
}
</script>

<style>

</style>
