<template>
  <div class="about">
      <h3>Matan Nadav</h3>
      <img src="../../public/imgs/me.jpg" alt="">
      <p>
        This project simulates the world-class and fun game "Connect 4" or "Four in a row".
        <br />Its been an educating and fun challenge, hope you enjoy.
      </p>
  </div>
</template>

<script>

export default {
  
}
</script>
<style lang="scss" scoped>
  .about {
    background: #17a2b8;
    height: 31rem;
    width:  21rem;
    border: 1px solid black;
    border-radius: 5px;
    margin: 100px auto;
    & p {
        font-weight: 700;
        line-height: 25px;
        padding: 10px;
    }
    & img {
      width: 100%;
      height: 60%;
      object-fit: cover;
      border-radius: 50%;
    }
}
</style>
