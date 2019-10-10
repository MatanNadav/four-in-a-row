<template>  
<div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">Connect 4</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item><router-link class="router-link" to="/">Home</router-link></b-nav-item>
        <b-nav-item><router-link class="router-link" to="/game">Play</router-link></b-nav-item>
        <b-nav-item><router-link class="router-link" to="/setting">Settings</router-link></b-nav-item>
        <b-nav-item><router-link class="router-link" to="/about">About</router-link></b-nav-item>
      </b-navbar-nav>    
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    .router-link {
        color: white;
    }
</style>