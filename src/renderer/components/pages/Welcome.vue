<template>
  <main>
    <v-btn class="grey darken-3"
           :loading="loading"
           @click.native="loader = 'loading'"
           :disabled="loading">
      Reload
      <v-icon right>file_upload</v-icon>
    </v-btn>
  </main>
</template>

<script>
export default {
  name: 'welcome',
  data() {
    return {
      loader: null,
      loading: false
    }
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      this.$storage.reload((err, obj) => {
        if (err) {
          console.error(err)
        }
        this[l] = false
        this.loader = null
      })
    }
  }
}
</script>

<style>

</style>
