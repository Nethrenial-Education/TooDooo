<template>
  <v-container>
    <v-row>
      <v-card dark class="home">
        <h1>
          This is Remembrall..., keep your goals in check where ever you go!
        </h1>
        <h2>About</h2>
        <p>
          I (Nethsara Sandeepa Elvitigala) created this app as a project for my
          portfolio..You can use this app to keep track of your daily goals and
          long term plans..This app uses google's services to save your data,so
          as long as you login with your gogle account you can access them at
          anytime, in any part of this world.
        </p>
        <p>
          You can add tasks and you can delete them or mark them as complete any
          time you want. And after 24 hours,whether you've completed them or not
          tasks would disappear from the list and get deleted when You refresh
          the app.
        </p>
        <p>
          But long term plans are different,they would be kept as a reminder of
          your achievements forever unless you delete it manually.Once you
          achieve a goal just press the tick button and it will go to the list
          of achieved goals.
        </p>
        <h2>Tech Stack</h2>
        <ul>
          <li>
            <a href="https://vuejs.org/" target="_blank"><h3>Vue JS</h3></a>
          </li>
          <li>
            <a href="https://nuxtjs.org/" target="_blank"><h3>Nuxt JS</h3></a>
          </li>
          <li>
            <a href="https://vuetifyjs.com/" target="_blank"
              ><h3>Vuetify</h3></a
            >
          </li>
          <li>
            <a href="https://firebase.google.com/" target="_blank"
              ><h3>Firebase</h3></a
            >
          </li>
        </ul>
        <h2>
          Let's Get into work now ! (alternatively you can use the side drawer
          to navigate around the app)
        </h2>
        <div v-if="isLoggedIn" class="nav">
          <div class="nav">
            <nuxt-link to="/daily-goals" class="nav">
              <p class="nav">
                <v-icon>mdi-view-day</v-icon>

                Daily Goals
              </p>
            </nuxt-link>

            <nuxt-link to="/long-term-goals" class="nav">
              <p class="nav">
                <v-icon>mdi-calendar-blank</v-icon>

                Long Term Plans
              </p>
            </nuxt-link>
          </div>
        </div>
        <div v-else class="nav">
          <p class="nav">
            It seems that you're not currently logged in, please
            <v-btn dark depressed @click="login">Login</v-btn> first.
          </p>
        </div>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.GET_USER
    },
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login')
      } catch (error) {
        this.error = error
      }
    },
  },
}
</script>

<style scoped>
.home {
  width: 100vw;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.home h1 {
  text-align: center;
  padding: 5px;
  margin: 10px;
}

.home h2 {
  text-align: center;
  padding: 5px;
  margin: 10px;
}

.home p {
  text-align: center;
  opacity: 0.7;
  max-width: 80vw;
}

.list {
  text-align: center;
}
a {
  color: #ccc;
  text-decoration: none;
}

ul {
  list-style: none;
  margin: 0;
  padding: 20px 0;
}

li {
  padding: 5px;
  margin: 5px auto;
  background-color: #444;
  width: 200px;
}

a:visited,
a:active,
a:hover {
  color: #ccc;
  font-style: italic;
}

h3 {
  text-align: center;
}

nav {
  text-align: center;
  margin-bottom: 100px;
}
</style>
