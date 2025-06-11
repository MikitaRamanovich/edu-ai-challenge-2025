export class GameUI {
  static printBoard(playerBoard, opponentBoard, title = 'Game Board') {
    console.log(`\n${title}`);
    console.log('   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    
    const header = '  ' + Array.from({ length: playerBoard.size }, (_, i) => i).join(' ');
    console.log(header + '     ' + header);

    for (let i = 0; i < playerBoard.size; i++) {
      let rowStr = i + ' ';

      // Opponent board row
      for (let j = 0; j < opponentBoard.size; j++) {
        rowStr += opponentBoard.grid[i][j] + ' ';
      }
      
      rowStr += '    ' + i + ' ';

      // Player board row
      for (let j = 0; j < playerBoard.size; j++) {
        rowStr += playerBoard.grid[i][j] + ' ';
      }
      
      console.log(rowStr);
    }
    console.log();
  }

  static printGameStart(numShips) {
    console.log("\n🚢 Welcome to Modern Sea Battle! 🚢");
    console.log(`Try to sink the ${numShips} enemy ships.`);
    console.log('Enter coordinates like "00", "34", "98" to make your guess.');
    console.log('Legend: ~ = Water, S = Your Ship, X = Hit, O = Miss\n');
  }

  static printTurnResult(playerName, location, result) {
    const locationDisplay = `${location[0]},${location[1]}`;
    
    if (result.alreadyGuessed) {
      console.log(`${playerName}: Already guessed ${locationDisplay}!`);
      return;
    }

    if (result.hit) {
      if (result.sunk) {
        console.log(`${playerName}: HIT at ${locationDisplay}! 💥 Ship sunk! 🔥`);
      } else {
        console.log(`${playerName}: HIT at ${locationDisplay}! 💥`);
      }
    } else {
      console.log(`${playerName}: MISS at ${locationDisplay}. 💧`);
    }
  }

  static printGameEnd(winner, loser) {
    console.log('\n' + '='.repeat(50));
    if (winner.name === 'Player') {
      console.log('🎉 CONGRATULATIONS! You sunk all enemy battleships! 🎉');
    } else {
      console.log('💀 GAME OVER! The CPU sunk all your battleships! 💀');
    }
    console.log(`${winner.name} wins!`);
    console.log('='.repeat(50) + '\n');
  }

  static printShipPlacement(playerName, numShips) {
    console.log(`${numShips} ships placed randomly for ${playerName}.`);
  }

  static async getPlayerInput(rl, prompt = 'Enter your guess (e.g., 00): ') {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer?.trim());
      });
    });
  }

  static printError(message) {
    console.log(`❌ Error: ${message}`);
  }

  static printCpuThinking() {
    console.log("\n🤖 CPU is thinking...");
  }

  static printGameStats(player, cpu) {
    console.log(`\n📊 Ships remaining - You: ${player.getShipsRemaining()}, CPU: ${cpu.getShipsRemaining()}`);
  }
} 