<template>
  <main>
    <v-btn class="grey darken-3"
           :loading="reloadStatus"
           :disabled="reloadStatus"
           @click.native="reload()">
      Reload
      <v-icon right>file_upload</v-icon>
    </v-btn>

    <v-btn class="grey darken-3"
           :loading="savePayeeConfStatus"
           :disabled="savePayeeConfStatus"
           @click.native="savePayeeConf()">
      Save Payee Conf
      <v-icon right>save</v-icon>
    </v-btn>
  </main>
</template>

<script>
export default {
  name: 'welcome',
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
    }
  }
}
</script>

<style>

</style>
