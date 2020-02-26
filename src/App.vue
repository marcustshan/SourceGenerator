<template>
  <div id="app">
    <Header />
    <router-view></router-view>
    <Loading />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Loading from './components/Loading.vue'

export default {
  name: 'App',
  components: {
    Header,
    Loading
  }
}
</script>

<style>

</style>
