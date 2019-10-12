<template>
    <section class="settings-container flex row">
        <div class="form-container flex column">
            <h5>Player one settings</h5>
            <b-form-input v-model="game.playerOne.name" placeholder="Enter your name"></b-form-input>
            <div>
                <h6>Choose your color</h6>
                <b-form-input type="color" v-model="game.playerOne.color" placeholder="Player one color"></b-form-input>
            </div>
        </div>
        <div class="form-container flex column">
            <h5>Player Two settings</h5>
            <b-form-input v-model="game.playerTwo.name" placeholder="Enter your name"></b-form-input>
            <div>
                <h6>Choose your color</h6>
                <b-form-input type="color" v-model="game.playerTwo.color" placeholder="Player one color"></b-form-input>
            </div>
        </div>
        <div class="form-container flex column">
            <h5>Game Settings</h5>
            <h6>At the moment more than 9*9 is not availble due to canvas size on page</h6>
            <b-form-input type="number" v-model="game.board.rows" placeholder="Rows"></b-form-input>
            <b-form-input type="number" v-model="game.board.columns" placeholder="Columns"></b-form-input>
            <b-form-input type="number" v-model="game.board.numOfConnectionToWin" placeholder="Number of Connections to win"></b-form-input>
        </div>
        <button class="submit-btn" @click="submit">Submit and go to game</button>
    </section>
</template>

<script>
  export default {
    data() {
      return {
            game: {
                board:{rows: 6, columns: 7, numOfConnectionToWin: 4},
                playerOne: {color: 'blue', name: 'Shani', id: 1},
                playerTwo: {color: 'red', name: 'Sam', id: 2},
            },
        }
    },
    methods: {
        submit() {
            let game = this.game
            this.$store.dispatch({type:'initGame', game})
            this.$router.push('/game')
        }
    }
  }
</script>

<style lang="scss" scoped>
  .settings-container {
      justify-content: space-around;
      width: 50rem;
      height: 50rem;
      margin: 100px auto;
      border: 3px solid black
    }
    .form-container {
        justify-content: space-around;
        width: 20rem;
        height: 20rem;
        & h5 {
            text-decoration: underline
        }
    }
    .submit-btn {
        position: absolute;
        bottom: 50px;
        border: 0;
        padding: 10px;
        text-decoration: none;
        background-color: lightgreen;
        &:hover {
            opacity: 0.8
        }
    }
    .flex {
        display: flex;
    }
    .row {
        flex-direction: row
    }
    .column {
        flex-direction: column
    }
</style>