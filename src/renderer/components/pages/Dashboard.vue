<template>
  <main>
    <v-container>
      <v-data-table v-bind:headers="headers"
                    :items="items"
                    hide-actions
                    class="elevation-1">
        <template slot="items"
                  scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.id }}</td>
          <td class="text-xs-right">{{ props.item.accountNumber }}</td>
          <td class="text-xs-right">{{ props.item.institutionId }}</td>
          <td class="text-xs-right">{{ props.item.parentId }}</td>
          <td class="text-xs-right">{{ $repo.getAccountBalance(props.item.id) }}</td>
        </template>
      </v-data-table>
    </v-container>
  </main>
</template>

<script>
export default {
  name: 'page-dashboard',
  data() {
    return {
      headers: [
        {
          text: 'Bank Account',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'ID', value: 'id' },
        { text: 'Number', value: 'accountNumber' },
        { text: 'Institution', value: 'institutionId' },
        { text: 'Parent ID', value: 'parentID' },
        { text: 'Balance', value: 'balance' }
      ],
      items: this.$repo.isLoaded() ? this.$repo.bankAccounts() : []
    }
  }
}

</script>

<style>

</style>
