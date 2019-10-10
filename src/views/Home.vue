<template>
  <div class="home">
    <WelcomeScreen></WelcomeScreen>
  </div>
</template>

<script>
// @ is an alias to /src
import WelcomeScreen from '@/components/WelcomeScreen.vue'

export default {
  name: 'home',
  components: {
    WelcomeScreen
  }
}
</script>
