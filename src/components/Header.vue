<template>
  <header>
    <div class="title">
      Source Generator
    </div>
    <div class="logo">
      <img src="~@/assets/images/logo.png" alt="logo" />
    </div>
  </header>
</template>

<script>
  export default {
    name: 'common-header'
  }
</script>

<style scoped>
header {position: relative; width: 100%; height: 60px; background-color: #e0e0e0; border-bottom: 1px solid #c1c1c1; text-align: center;}
header div.logo {z-index: 5; position: absolute; top: 0; left: 0; width: 160px; height: 60px; cursor: pointer; margin-left: 10px;}
header div.logo img {width: 100%; height: 100%; object-fit: contain;}
header div.title {width: 100%; height: 60px; line-height: 60px; font-weight: 600;}
</style>
