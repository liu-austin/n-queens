// jshint esversion:6
/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
createNestedArray = function(n) {
  var solutionsArr = [];
  for (var i = 0; i < n; i++) {
    solutionsArr.push([]);
    for (var j = 0; j < n; j++) {
      solutionsArr[i].push(0);
    }
  }
  return solutionsArr;
};

copyArray = function(arr) {
  var solutionsArr = [];
  for (var i = 0; i < arr.length; i++) {
    solutionsArr.push([]);
    for (var j = 0; j < arr[0].length; j++) {
      solutionsArr[i].push(arr[i][j]);
    }
  }
  return solutionsArr;
};

getAllBoardCombinations = function(n, depth = n, arr = [createNestedArray(n)]) {
  var solutionsArr = [];
  var fills, fillIndex, filled, index, fillerArray;
  if (depth === 0) {
    return arr;
  } else {
    for (var i = 0; i < arr.length; i++) {
      index = 0;
      fills = depth;
      while (fills > 0) {
        filled = false;
        for (var j = 0; j < n; j++) {
          if (arr[i][j][index] === 1) {
            filled = true;
          }
        }
        if (!filled) {
          fillerArray = copyArray(arr[i]);
          fillerArray[n - depth][index] = 1;
          solutionsArr.push(fillerArray);
          fills -= 1;
        }
        index += 1;
      }
    }
    return getAllBoardCombinations(n, depth - 1, solutionsArr);
  }
};

window.findNRooksSolution = function(n) {
  var solution = getAllBoardCombinations(n)[0];



  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = getAllBoardCombinations(n).length;

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var allRookCombinations = getAllBoardCombinations(n);
  var solutions = [];
  var Chart;
  for (var i = 0; i < allRookCombinations.length; i++) {
    Chart = new Board(allRookCombinations[i]);
    if (!Chart.hasAnyQueensConflicts()) {
      solutions.push(allRookCombinations[i]);
    }
  }
  if (!solutions.length) {
    solutions = [0];
  }
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solutions[0]));
  return solutions[0];
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var allRookCombinations = getAllBoardCombinations(n);
  var solutions = [];
  var Chart;
  for (var i = 0; i < allRookCombinations.length; i++) {
    Chart = new Board(allRookCombinations[i]);
    if (!Chart.hasAnyQueensConflicts()) {
      solutions.push(allRookCombinations[i]);
    }
  }
  solutionCount = solutions.length;
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
