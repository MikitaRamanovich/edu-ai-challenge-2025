import { Game } from './models/Game.js';

// Default game configuration
const defaultConfig = {
  boardSize: 10,
  numShips: 3,
  shipLength: 3
};

// Parse command line arguments for custom configuration
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...defaultConfig };
  
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--board-size':
        config.boardSize = parseInt(value) || defaultConfig.boardSize;
        break;
      case '--num-ships':
        config.numShips = parseInt(value) || defaultConfig.numShips;
        break;
      case '--ship-length':
        config.shipLength = parseInt(value) || defaultConfig.shipLength;
        break;
      case '--help':
        console.log(`
Sea Battle Game Options:
  --board-size <number>    Set board size (default: ${defaultConfig.boardSize})
  --num-ships <number>     Set number of ships (default: ${defaultConfig.numShips})
  --ship-length <number>   Set ship length (default: ${defaultConfig.shipLength})
  --help                   Show this help message

Example: node src/index.js --board-size 8 --num-ships 4
        `);
        process.exit(0);
        break;
    }
  }
  
  return config;
}

// Handle graceful shutdown
function setupGracefulShutdown(game) {
  const shutdown = () => {
    console.log('\n\nShutting down game...');
    game.cleanup();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Main function
async function main() {
  try {
    const config = parseArgs();
    const game = new Game(config);
    
    setupGracefulShutdown(game);
    
    await game.start();
    
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

// Start the application
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 