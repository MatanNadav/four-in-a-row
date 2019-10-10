<template>
    <section class="canvas-container">
        <h4 v-if="currPlayer.name">{{currPlayer.name}}'s turn to play</h4>
        <button v-else-if="!currPlayer.name" @click="restartGame" class="start-over-btn">Start Game</button>
        <h4 v-else>Game Over</h4>
        <canvas class="canvas" ref="canvas" @click="cellClicked($event)"></canvas>
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
            animation: 0,
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
                await this.drawCircle(canvasXCor, canvasYCor)
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
                    if (col < 5) {
                        this.paintRect(row * 100 + 5, col * 100 + 5, 90, 'red')
                    }
                    if (col === this.board.rows - 1 && this.validPos.length < 7) {
                        this.validPos.push({x: row*100+50, y: 550, isPicked: false})
                    }
                }
            }
        },
        checkWin(x, y) {
            let board = this.$store.getters.getBoard;
            let mat = board.matrix
            let n = 0; // number to increment with
            let counter = 0;
            let key = mat[0].length -1;
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
            counter = 0;
            if ( y >= x ) { // checking half the matrix diagonals
                while ( ((y-x) + n + 1) <= mat[0].length - 1 && (x-(key-y) + n + 1) <= mat.length - 1) {
                    // checking down-right diagonal
                    if (mat[(x-x) + n][(y-x) + n].pickedById === mat[(x-x) + n + 1][(y-x) + n + 1].pickedById && mat[(x-x) + n][(y-x) + n].pickedById) {
                        counter++
                        if (counter === board.numOfConnectionToWin - 1) {
                            this.announceWin(mat[x][y].pickedById)
                            return
                        }
                    }
                    else if (x + y <= mat[0].length-1 && ((y+x) - n - 1) > -1 ) {
                        // checking down-left diagonal
                        if (mat[(x-x) + n][(y+x) - n].pickedById === mat[(x-x) + n + 1][(y+x) - n - 1].pickedById && mat[(x-x) + n][(y+x) - n].pickedById) {
                            counter++
                            if (counter === board.numOfConnectionToWin - 1) {
                                this.announceWin(mat[x][y].pickedById)
                                return
                            }
                        } else counter = 0;
                    } else { // when x + y are bigger than mat[0].length-1
                        if (mat[x-(key-y) + n][key - n].pickedById === mat[x-(key-y) + n + 1][key - n - 1].pickedById && mat[x-(key-y) + n][key - n].pickedById) {
                            counter++
                            if (counter === board.numOfConnectionToWin - 1) {
                                this.announceWin(mat[x][y].pickedById)
                                return
                            }
                        } else counter = 0;
                    }
                    n++
                }
            } else { // when y < x - checking the other half of the matrix diagonals
                n = 0;
                while( (x-y + n + 1) < mat.length && (x-(key - y) + n + 1) < mat.length) {
                    if (mat[x-y + n][0 + n].pickedById === mat[x-y + n + 1][0 + n + 1].pickedById && mat[x-y + n][0 + n].pickedById) {
                        counter++
                        if (counter === board.numOfConnectionToWin - 1) {
                            this.announceWin(mat[x][y].pickedById)
                            return
                        }
                    }
                    else if ( x + y <= key ) {
                        if (mat[0 + n][x+y - n].pickedById === mat[0 + n + 1][x+y - n - 1] && mat[0 + n][x+y - n].pickedById) {
                            counter++
                            if (counter === board.numOfConnectionToWin - 1) {
                                this.announceWin(mat[x][y].pickedById)
                                return
                            }
                        } else counter = 0;
                    } else { // when  x + y > key. key = the length of the row - columns
                        if (mat[x-(key - y) + n][key - n].pickedById === mat[x-(key - y) + n + 1][key - n - 1].pickedById && mat[x-(key - y) + n][key - n].pickedById) {
                            counter++
                            if (counter === board.numOfConnectionToWin - 1) {
                                this.announceWin(mat[x][y].pickedById)
                                return
                            }
                        } else counter = 0;
                    }
                    n++
                }
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
    .canvas-container {
        height: 85vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        background-color: whitesmoke;
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