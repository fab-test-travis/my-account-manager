<template>
  <main>
    <v-container fluid>
      <v-layout row
                wrap>

        <v-flex xs4>
          <v-list two-line dense>
            <template v-for="(item, index) in items">
              <v-divider v-if="index > 0"
                         :inset="true"
                         :key="index"></v-divider>
              <v-list-tile avatar
                           :key="item.id"
                           :to="'/accounts/' + item.id">
                <v-list-tile-avatar>
                  <img :src="$format.institutionIcon(item.institutionId)"></v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.accountNumber"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>
                    {{ $format.amount($repo.getAccountBalance(item.id) / 100) }} &euro;
                  </v-list-tile-action-text>
                  <v-icon class="grey--text text--lighten-1">star_border</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>

      </v-layout>
    </v-container>
  </main>
</template>

<script>
export default {
  name: 'dashboard',
  data() {
    return {
      items: this.$repo.isLoaded() ? this.$repo.bankAccounts() : [],
      items2: [
        { avatar: '/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--lighten-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
        { divider: true, inset: true },
        { avatar: '/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--lighten-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
        { divider: true, inset: true },
        { avatar: '/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='grey--text text--lighten-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
      ]
    }
  },
  methods: {
    foo(id) {
      alert(id)
    }
  }
}

</script>

<style>

</style>
