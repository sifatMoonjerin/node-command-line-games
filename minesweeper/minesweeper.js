import chalk from 'chalk';
import prompt from 'prompt';

import Board from './Board.js';

const minesweeper = async () => {
    console.log(chalk.green('\nIT\'S TIME TO SWEEP MINES'));

    const board = new Board();
    board.initialize();
    board.display();

    let gameWon = true;
    prompt.start();

    while (!board.isGameOver) {
        try {
            const {row, col} = await prompt.get(['row', 'col']);
            gameWon = board.digCell(parseInt(row), parseInt(col));
            board.display();
        } catch (error) {
            console.log(`${chalk.red(error.name)}: ${error.message}`);
            return;
        }
    }

    if (gameWon) {
        console.log(chalk.green('Congratulations!!! You won!!!\n'));
    } else {
        console.log(chalk.red('KABOOM!!! Better luck next time!!!\n'));
    }
}

export default minesweeper;
