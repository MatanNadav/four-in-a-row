<template>
    <section class="game-container">
        <h4 v-if="currPlayer.name" class="player-turn-head">{{currPlayer.name}}'s turn to play</h4>
        <button v-else-if="!currPlayer.name" @click="restartGame" class="start-over-btn">Start Game</button>
        <h4 v-else>Game Over</h4>
        <div class="canvas-container">
            <canvas class="canvas" ref="canvas" @click="cellClicked($event)"></canvas>
        </div>
    </section>

</template>

<script>
export default {
    data() {
        return {
            canvas:null,
            ctx:null,
            board: {},
            validPos: [],
            currPlayer: {},
        }
    },
    created() {
        this.$store.dispatch({type: 'createBoard'})
        this.$store.dispatch({type: 'advanceTurn'})
        this.currPlayer = this.$store.getters.getCurrPlayer
        this.board = this.$store.getters.getBoard
    },
    mounted() {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.$store.getters.getWidth * 100;
        this.canvas.height = this.$store.getters.getHeight * 100;
        this.renderCanvas() 
    },
    destroyed() {
       this.$store.dispatch('gameDefaults')
    },
    methods: {
        async cellClicked(ev) {
            
            let canvasXCor = Math.ceil(ev.offsetX / 100) * 100 - 50 ;
            let canvasYCor = Math.ceil(ev.offsetY/ 100) * 100 - 50;
            let cellX  = Math.floor(ev.offsetY / 100);
            let cellY = Math.floor(ev.offsetX / 100);
            
            const idx = this.validPos.findIndex(cell => {
                return (cell.x === canvasXCor && cell.y === canvasYCor && cell.isPicked === false)
            })
            if(idx > -1) {
                this.drawCircle(canvasXCor, canvasYCor)
                await this.$store.dispatch({type: 'updateMatrix', cellX, cellY})
                this.advanceGame(canvasXCor, canvasYCor, this.currPlayer.id, idx)
                if(this.validPos.length > this.board.numOfConnectionToWin * 2 -1) {
                    this.checkWin(cellX, cellY);
                }
            }
            else this.$swal.fire({type: 'error',title: 'Oops...', text: 'Not a valid cell',})
        },

        drawCircle(x, y) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, 30, 0, Math.PI * 2);
            this.ctx.fillStyle = this.currPlayer.color
            this.ctx.fill()
            this.ctx.closePath();
        },
        paintRect(x, y, size, color) {
            if (color === 'red') this.ctx.globalAlpha = 0.6
            this.ctx.beginPath();
            this.ctx.fillStyle = color
            this.ctx.fillRect(x, y, size, size)
            this.ctx.closePath();
            this.ctx.globalAlpha = 1
        },
        renderCanvas() {
            for ( var row = 0; row <= this.board.rows; row++) {
                for (var col = 0; col <= this.board.columns; col++) {
                    this.ctx.moveTo(0, 100 * col)
                    this.ctx.lineTo(this.board.columns * 100, 100 * col)
                    this.ctx.stroke()

                    this.ctx.moveTo(100 * row, 0)
                    this.ctx.lineTo(100 * row, this.board.rows * 100)
                    this.ctx.stroke()
                    if (col < this.board.rows - 1) {
                        this.paintRect(row * 100 + 5, col * 100 + 5, 90, 'red')
                    }
                    if (col === this.board.rows - 1 && this.validPos.length < this.board.matrix[0].length) {
                        this.validPos.push({x: row*100+50, y: this.board.rows * 100 - 50, isPicked: false})
                    }
                }
            }
        },
        checkWin(x, y) {
            let board = this.$store.getters.getBoard;
            let mat = board.matrix
            let n = 0; // number to increment with
            let counter = 0;
            let downRCounter = 0; // connections counter for down right horizontal 
            let downLCounter = 0; // connections counter for down left horizontal 

            for (var row = 0; row < board.rows - 1; row++) {
                if (mat[row][y].pickedById === mat[row + 1][y].pickedById && mat[row][y].pickedById) { // cheking win vertically in pairs
                    counter ++
                    if (counter === board.numOfConnectionToWin - 1) {
                        this.announceWin(mat[x][y].pickedById)
                        return
                    } 
                } else counter = 0;
            }
            counter = 0;
            for (var col = 0; col < board.columns - 1; col++) {
                 if (mat[x][col].pickedById === mat[x][col + 1].pickedById && mat[x][col].pickedById) { // cheking win horizontally in pairs
                    counter ++
                    if (counter === board.numOfConnectionToWin - 1) {
                        this.announceWin(mat[x][y].pickedById)
                        return
                    }
                } else counter = 0;
            }
            // diagonals: 
            while ( (x + n < mat.length - 1|| x - n > 0) && y + n < mat[0].length - 1) { //checking only to the right of x,y
                if (x - n > 0) { // checking when x can decrement
                   if(mat[x-n][y+n].pickedById === mat[x-n-1][y+n+1].pickedById && mat[x-n][y+n].pickedById) {
                       downLCounter++
                       if (downLCounter === board.numOfConnectionToWin - 1) {
                           this.announceWin(mat[x][y].pickedById)
                           return 
                       }
                   }
                   else downLCounter = 0;
                }
                if (x + n < mat.length-1) { // checking when x can increment
                    if (mat[x+n][y+n].pickedById === mat[x+n+1][y+n+1].pickedById && mat[x+n][y+n].pickedById) {
                        downRCounter++
                        if (downRCounter === board.numOfConnectionToWin - 1) {
                            this.announceWin(mat[x][y].pickedById)
                            return
                        }
                    }
                    else downRCounter = 0;
                }
                n++
            }
            n = 0
            while ((x + n < mat.length || x - n >= 0) && y - n > 0) { // checking only to the left of x,y
                if (x - n > 0) { // checking when x can decrement
                    if (mat[x-n][y-n].pickedById === mat[x-n-1][y-n-1].pickedById && mat[x-n][y-n].pickedById) {
                        downRCounter++
                        if (downRCounter === board.numOfConnectionToWin - 1) {
                            this.announceWin(mat[x][y].pickedById)
                            return
                        }
                    }
                    else downRCounter = 0;
                }
                if ( x + n < mat.length -1) { // checking when x can increment
                    if (mat[x+n][y-n].pickedById === mat[x+n+1][y-n-1].pickedById && mat[x+n][y-n].pickedById) {
                        downLCounter++
                        if (downLCounter === board.numOfConnectionToWin - 1) {
                            this.announceWin(mat[x][y].pickedById)
                            return
                        }
                    }
                    else downLCounter = 0;
                }
                n++
            }

        },
        async advanceGame(x, y, id, idx) {
            this.validPos[idx] = {x, y, isPicked: true};
            if( y !== 50) {
                this.validPos.push({x, y: y-100, isPicked: false})
                this.paintRect(x - 45, y - 145, 90, 'whitesmoke')
            }
            await this.$store.dispatch({type: 'advanceTurn', id})
            this.currPlayer = this.$store.getters.getCurrPlayer
        },
        announceWin(id) {
            if (id === 1) {
                this.$swal.fire('Good job!',`Player one has won the game`,'success')
            }
            else this.$swal.fire('Good job!',`Player Two has won the game`,'success')
            this.$store.dispatch('gameDefaults')

        },
        restartGame() {
            this.validPos = []
            this.ctx.clearRect(0, 0, this.board.columns*100, this.board.rows*100)
            this.$store.dispatch({type: 'createBoard'})
            this.$store.dispatch({type: 'advanceTurn'})
            this.currPlayer = this.$store.getters.getCurrPlayer
            this.board = this.$store.getters.getBoard
            this.canvas = this.$refs.canvas;
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = this.$store.getters.getWidth * 100;
            this.canvas.height = this.$store.getters.getHeight * 100;
            this.renderCanvas() 
        }
    }
}
</script>


<style lang="scss" scoped >
    .canvas {
        border: 2px solid black;
    }
    .game-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        background-color: whitesmoke;
    }
    .canvas-container {
        margin: 100px;
    }
    .player-turn-head {
        position: absolute;
        left: 50px;
        top: 75px;
    }
    .start-over-btn {
        border: 0;
        font-weight: bold;
        font-size: 20px;
        padding: 10px;
        text-decoration: none;
        background-color: lightgreen;
        &:hover {
            opacity: 0.8
        }
    }
</style>