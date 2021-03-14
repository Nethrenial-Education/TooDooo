<template>
  <v-app dark>
    <v-app-bar elevate-on-scroll dark max-height="60px">
      <v-app-bar-nav-icon
        aria-label="toggle side drawer"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
      <v-app-bar-title>Remembrall</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary dark>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="white--text text--accent-8"
        >
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item to="/daily-goals">
            <v-list-item-icon>
              <v-icon>mdi-view-day</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Daily Goals</v-list-item-title>
          </v-list-item>

          <v-list-item to="/long-term-goals">
            <v-list-item-icon>
              <v-icon>mdi-calendar-blank</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Long Term Goals</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!isLoggedIn" @click="login">
            <v-list-item-icon>
              <v-icon>mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
          <v-list-item v-else @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main class="background">
      <v-container> <nuxt keep-alive /> </v-container
    ></v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
  }),
  computed: {
    isLoggedIn() {
      if (this.$store.getters.GET_USER) {
        return true
      }
      return false
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.$router.replace('/daily-goals')
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login')
      } catch (error) {
        this.error = error
      }
    },
    async logout() {
      await this.$store.dispatch('logout')
    },
  },
}
</script>

<style>
.background {
  background-color: #262626;
}
</style>
