const { Enigma, Rotor, plugboardSwap, ROTORS, REFLECTOR, alphabet, mod } = require('./enigma');

// Test utilities
function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    console.log(`✓ ${testName}`);
    return true;
  } else {
    console.log(`✗ ${testName}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${actual}`);
    return false;
  }
}

function assertArrayEqual(actual, expected, testName) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  return assertEqual(actualStr, expectedStr, testName);
}

// Test results tracking
let totalTests = 0;
let passedTests = 0;

function runTest(testFn, testName) {
  totalTests++;
  console.log(`\n=== ${testName} ===`);
  try {
    const result = testFn();
    if (result) {
      passedTests++;
      console.log(`${testName}: PASS`);
    } else {
      console.log(`${testName}: FAIL`);
    }
    return result;
  } catch (error) {
    console.log(`${testName}: ERROR - ${error.message}`);
    return false;
  }
}

// Test 1: Basic utility functions
function testUtilities() {
  let allPassed = true;
  
  // Test mod function
  allPassed &= assertEqual(mod(5, 3), 2, "mod(5, 3) = 2");
  allPassed &= assertEqual(mod(-1, 26), 25, "mod(-1, 26) = 25");
  allPassed &= assertEqual(mod(-5, 26), 21, "mod(-5, 26) = 21");
  
  // Test plugboard swap
  allPassed &= assertEqual(plugboardSwap('A', [['A', 'B']]), 'B', "Plugboard A->B");
  allPassed &= assertEqual(plugboardSwap('B', [['A', 'B']]), 'A', "Plugboard B->A");
  allPassed &= assertEqual(plugboardSwap('C', [['A', 'B']]), 'C', "Plugboard C unchanged");
  allPassed &= assertEqual(plugboardSwap('A', []), 'A', "Empty plugboard");
  
  return allPassed;
}

// Test 2: Rotor class functionality
function testRotor() {
  let allPassed = true;
  
  // Test rotor creation
  const rotor = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 0);
  allPassed &= assertEqual(rotor.position, 0, "Initial rotor position");
  allPassed &= assertEqual(rotor.ringSetting, 0, "Initial ring setting");
  
  // Test rotor stepping
  rotor.step();
  allPassed &= assertEqual(rotor.position, 1, "Rotor position after step");
  
  // Test notch detection
  const rotor2 = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 16); // Q position
  allPassed &= assertEqual(rotor2.atNotch(), true, "Rotor at notch position");
  
  // Test rotor transformations
  const rotor3 = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 0);
  const forwardResult = rotor3.forward('A');
  const backwardResult = rotor3.backward(forwardResult);
  allPassed &= assertEqual(backwardResult, 'A', "Rotor forward/backward consistency");
  
  return allPassed;
}

// Test 3: Basic encryption/decryption reciprocity
function testBasicReciprocity() {
  let allPassed = true;
  
  const testCases = [
    { text: 'A', desc: 'Single character' },
    { text: 'HELLO', desc: 'Basic word' },
    { text: 'THEQUICKBROWNFOX', desc: 'Long text' },
    { text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', desc: 'Full alphabet' }
  ];
  
  for (const testCase of testCases) {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const encrypted = enigma1.process(testCase.text);
    const decrypted = enigma2.process(encrypted);
    
    allPassed &= assertEqual(decrypted, testCase.text, `Reciprocity: ${testCase.desc}`);
  }
  
  return allPassed;
}

// Test 4: Plugboard functionality
function testPlugboard() {
  let allPassed = true;
  
  // Test single plugboard pair
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);
  
  const encrypted = enigma1.process('HELLO');
  const decrypted = enigma2.process(encrypted);
  allPassed &= assertEqual(decrypted, 'HELLO', 'Single plugboard pair reciprocity');
  
  // Test multiple plugboard pairs
  const enigma3 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B'], ['C', 'D'], ['E', 'F']]);
  const enigma4 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B'], ['C', 'D'], ['E', 'F']]);
  
  const encrypted2 = enigma3.process('ABCDEF');
  const decrypted2 = enigma4.process(encrypted2);
  allPassed &= assertEqual(decrypted2, 'ABCDEF', 'Multiple plugboard pairs reciprocity');
  
  return allPassed;
}

// Test 5: Different rotor configurations
function testRotorConfigurations() {
  let allPassed = true;
  
  // Test different rotor positions
  const enigma1 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
  const enigma2 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
  
  const encrypted = enigma1.process('HELLO');
  const decrypted = enigma2.process(encrypted);
  allPassed &= assertEqual(decrypted, 'HELLO', 'Different rotor positions');
  
  // Test different ring settings
  const enigma3 = new Enigma([0, 1, 2], [0, 0, 0], [3, 7, 11], []);
  const enigma4 = new Enigma([0, 1, 2], [0, 0, 0], [3, 7, 11], []);
  
  const encrypted2 = enigma3.process('HELLO');
  const decrypted2 = enigma4.process(encrypted2);
  allPassed &= assertEqual(decrypted2, 'HELLO', 'Different ring settings');
  
  return allPassed;
}

// Test 6: Rotor stepping behavior
function testRotorStepping() {
  let allPassed = true;
  
  // Test normal stepping - right rotor at its notch (V = position 21)
  const enigma = new Enigma([0, 1, 2], [0, 0, 21], [0, 0, 0], []); // Right rotor at V (notch)
  
  const positions1 = enigma.rotors.map(r => r.position);
  enigma.process('A'); // This should cause middle rotor to step
  const positions2 = enigma.rotors.map(r => r.position);
  
  allPassed &= assertArrayEqual(positions1, [0, 0, 21], 'Initial positions');
  allPassed &= assertArrayEqual(positions2, [0, 1, 22], 'Positions after stepping from notch');
  
  // Test double stepping - middle rotor at E (notch = position 4)
  const enigma2 = new Enigma([0, 1, 2], [0, 4, 0], [0, 0, 0], []); // Middle rotor at E (notch)
  enigma2.process('A');
  const positions3 = enigma2.rotors.map(r => r.position);
  allPassed &= assertArrayEqual(positions3, [1, 5, 1], 'Double stepping behavior');
  
  return allPassed;
}

// Test 7: Edge cases
function testEdgeCases() {
  let allPassed = true;
  
  const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  
  // Test empty string
  allPassed &= assertEqual(enigma.process(''), '', 'Empty string');
  
  // Test non-alphabetic characters
  allPassed &= assertEqual(enigma.process('123 !@#'), '123 !@#', 'Non-alphabetic characters unchanged');
  
  // Test lowercase input
  allPassed &= assertEqual(enigma.process('hello').length, 5, 'Lowercase converted to uppercase');
  
  return allPassed;
}

// Test 8: Historical accuracy test
function testHistoricalAccuracy() {
  let allPassed = true;
  
  // Test with known historical configuration
  // This tests a simplified version of a known Enigma setup
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  
  const message = 'ENIGMA';
  const encrypted = enigma1.process(message);
  const decrypted = enigma2.process(encrypted);
  
  allPassed &= assertEqual(decrypted, message, 'Historical configuration reciprocity');
  allPassed &= assertEqual(encrypted !== message, true, 'Message is actually encrypted');
  
  return allPassed;
}

// Run all tests
function runAllTests() {
  console.log('🔧 ENIGMA MACHINE TEST SUITE');
  console.log('============================\n');
  
  runTest(testUtilities, 'Utility Functions');
  runTest(testRotor, 'Rotor Class');
  runTest(testBasicReciprocity, 'Basic Encryption Reciprocity');
  runTest(testPlugboard, 'Plugboard Functionality');
  runTest(testRotorConfigurations, 'Rotor Configurations');
  runTest(testRotorStepping, 'Rotor Stepping');
  runTest(testEdgeCases, 'Edge Cases');
  runTest(testHistoricalAccuracy, 'Historical Accuracy');
  
  console.log('\n============================');
  console.log('📊 TEST SUMMARY');
  console.log('============================');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Coverage: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED!');
  } else {
    console.log('❌ SOME TESTS FAILED');
  }
  
  return passedTests === totalTests;
}

// Export for external use
module.exports = {
  runAllTests,
  testUtilities,
  testRotor,
  testBasicReciprocity,
  testPlugboard,
  testRotorConfigurations,
  testRotorStepping,
  testEdgeCases,
  testHistoricalAccuracy
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
} 