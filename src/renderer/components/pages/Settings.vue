<template>
  <main>
    <div>
      <v-btn class="grey darken-3"
            :loading="reloadStatus"
            :disabled="reloadStatus"
            @click.native="reload()">
        Reload
        <v-icon right>file_upload</v-icon>
      </v-btn>
    </div>
    <div>
      <v-btn class="grey darken-3"
            :loading="savePayeeConfStatus"
            :disabled="savePayeeConfStatus"
            @click.native="savePayeeConf()">
        Save Payee Conf
        <v-icon right>save</v-icon>
      </v-btn>
    </div>
    <div>
      <v-btn class="grey darken-3"
            @click.native="shrinkCategories()">
        Shrink Categories
        <v-icon right>compare_arrows</v-icon>
      </v-btn>
    </div>
  </main>
</template>

<script>
export default {
  name: 'settings',
  data() {
    return {
      reloadStatus: false,
      savePayeeConfStatus: false
    }
  },
  methods: {
    reload() {
      this.reloadStatus = true
      this.$storage.reload((err, obj) => {
        if (err) {
          console.error(err)
        }
        this.reloadStatus = false
      })
    },
    savePayeeConf() {
      this.savePayeeConfStatus = true
      this.$storage.savePayeeFinders(err => {
        if (err) {
          console.error(err)
        }
        this.savePayeeConfStatus = false
      })
    },
    shrinkCategories() {
      this.$repo.categories().forEach(category => {
        let count = this.$repo.transactionsForCategory(category.id).length
        if (category.subAccountIds == null && count === 0) {
          delete this.$repo.storage.repo.categories[category.id]
        }
      })
    }
  }
}
</script>

<style>

</style>
