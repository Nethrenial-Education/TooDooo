<template>
  <v-container class="home">
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/" class="homelink"> Home page </NuxtLink>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-content: center;
  align-items: center;
  align-self: center;
  justify-content: center;
  background-color: #333;
}

.home h1 {
  text-align: center;
  padding: 5px;
  margin: 10px;
  font-size: 30px;
  color: #eee;
}

.homelink {
  color: #eee;
  text-decoration: none;
}
.homelink:hover {
  color: #999;
  text-decoration: underline;
}
</style>
