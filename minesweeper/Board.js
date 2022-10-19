import chalk from 'chalk';

export default class Board {
    constructor (size = 10, bombs = 10) {
        this.board = Array(size).fill().map(() => Array(size).fill(' '));
        this.size = size;
        this.bombs = bombs;
        this.dug = new Set();
        this.gameOver = false;
    }

    initialize() {
        this.plantBombs();
        this.updateEmptyCells();
    }

    plantBombs() {
        const planted = new Set();
        while (planted.size < this.bombs) {
            const row = Math.floor(Math.random() * this.size);
            const col = Math.floor(Math.random() * this.size);
            const coordinate = `${row}_${col}`;
            if (!planted.has(coordinate)) {
                this.board[row][col] = '*';
                planted.add(coordinate);
            }
        }
    }

    updateEmptyCells() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] !== '*') {
                    this.board[row][col] = this.getNeighboringBombCount(row, col);
                }
            }
        }
    }

    getNeighboringBombCount(r, c) {
        let count = 0;
        for (let row = Math.max(0, r - 1); row < Math.min(this.size, r + 2); row++) {
            for (let col = Math.max(0, c - 1); col < Math.min(this.size, c + 2); col++) {
                if (this.board[row][col] === '*') {
                    count++;
                }
            }
        }
        return count.toString();
    }

    digCell(r, c) {
        if (this.board[r][c] === '*') {
            this.gameOver = true;
            return false;
        }

        const queue = [[r, c]]

        while (queue.length > 0) {
            const [row, col] = queue.shift();
            if (!this.dug.has(`${row}_${col}`)) {
                this.dug.add(`${row}_${col}`);
                if (this.board[row][col] === '0') {
                    for (let newRow = Math.max(0, row - 1); newRow < Math.min(this.size, row + 2); newRow++) {
                        for (let newCol = Math.max(0, col - 1); newCol < Math.min(this.size, col + 2); newCol++) {
                            if (newRow === row && newCol === col) {
                                continue
                            }
                            queue.push([newRow, newCol]);
                        }
                    }
                }
            } 
        }

        this.gameOver = this.dug.size === (this.size * this.size - this.bombs); 

        return true;
    }

    display() {
        console.log('\n');
        for (let row = 0; row <= this.size; row++) {
            let str = chalk.blue(`|${row === 0 ? ' ' : row - 1}|`)
            for (let col = 0; col < this.size; col++) {
                if (row == 0) {
                    str += chalk.blue(`${col}|`)
                } else {
                    let val = ' ';
                    if (this.gameOver || this.dug.has(`${row - 1}_${col}`)) {
                        if (this.board[row - 1][col] === '*') {
                            val = chalk.red(`${this.board[row - 1][col]}`);
                        } else {
                            val = `${this.board[row - 1][col]}`;
                        }
                    }

                    str += `${val}|`
                }
            }
            console.log(str)
        }
        console.log('\n');
    }

    get isGameOver() {
        return this.gameOver;
    }
}