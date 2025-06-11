# 🚢 Modern Sea Battle Game

A completely modernized and refactored implementation of the classic Sea Battle (Battleship) game, transformed from legacy procedural JavaScript to modern ES6+ with comprehensive testing.

## ✨ Features

- **Modern ES6+ JavaScript**: Classes, modules, async/await, and more
- **Object-Oriented Architecture**: Clean separation of concerns
- **Smart AI Opponent**: Hunt and target modes for challenging gameplay
- **Comprehensive Testing**: 109 tests with 76%+ coverage
- **Command Line Interface**: Configurable game parameters
- **Enhanced UI**: Emoji-enhanced console interface

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the game
npm start

# Run tests
npm test

# Generate coverage report
npm run test:coverage
```

## 🎮 How to Play

- Enter coordinates like "00", "34", "98" to make your guess
- Try to sink all 3 enemy ships before the CPU sinks yours
- **Legend**: ~ = Water, S = Your Ship, X = Hit, O = Miss

## 🏗️ Architecture

```
src/
├── models/           # Core game logic
│   ├── Ship.js      # Ship entity
│   ├── Board.js     # Game board
│   ├── Player.js    # Human player
│   ├── CpuPlayer.js # AI player
│   └── Game.js      # Game orchestration
├── services/
│   └── GameUI.js    # User interface
└── index.js         # Entry point
```

## 📊 Test Coverage

- **Statements**: 76.29% ✅
- **Branches**: 81.66% ✅  
- **Functions**: 86.66% ✅
- **Lines**: 76.67% ✅

## 📈 Refactoring Achievements

- ✅ Eliminated 35+ global variables
- ✅ Converted to modular ES6+ architecture  
- ✅ Added comprehensive test suite (109 tests)
- ✅ Implemented proper error handling
- ✅ Enhanced AI with hunt/target logic
- ✅ Maintained all original game mechanics

See `refactoring.md` for detailed refactoring documentation.
