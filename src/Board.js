// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var pieces = 0;
      for (var i = 0; i < this.get(rowIndex).length; i++) {
        pieces += this.get(rowIndex)[i];
      }
      return pieces > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var anyConflicts = false;
      for (var i = 0; i < this.get('n'); i++) {
        if (this.hasRowConflictAt(i)) {
          anyConflicts = true;
        }
      }
      return anyConflicts;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var pieces = 0;
      for (var i = 0; i < this.get('n'); i++) {
        pieces += this.get(i)[colIndex];
      }
      return pieces > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var anyConflicts = false;
      for (var i = 0; i < this.get('n'); i++) {
        if (this.hasColConflictAt(i)) {
          anyConflicts = true;
        }
      }
      return anyConflicts;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var pieces = 0;
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        for (var i = 0; i < this.get('n'); i++) {
          if (this.get(i)[i + majorDiagonalColumnIndexAtFirstRow]) {
            pieces += this.get(i)[i + majorDiagonalColumnIndexAtFirstRow];
          }
        }
      } else {
        for (var j = -majorDiagonalColumnIndexAtFirstRow; j < this.get('n'); j++) {
          if (this.get(j)[j + majorDiagonalColumnIndexAtFirstRow]) {
            pieces += this.get(j)[j + majorDiagonalColumnIndexAtFirstRow];
          }
        }
      }

      return pieces > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var anyConflicts = false;
      for (var i = -3; i < this.get('n'); i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          anyConflicts = true;
        }
      }
      return anyConflicts;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var minor = minorDiagonalColumnIndexAtFirstRow;
      var pieces = 0;
      if (minor >= this.get('n')) {
        for (var i = minor; i < 2 * this.get('n') - 1; i++) {
          if (this.get(i - (this.get('n') - 1))[2 * this.get('n') - i - 1 + (minor - this.get('n'))]) {
            pieces += this.get(i - (this.get('n') - 1))[2 * this.get('n') - i - 1 + (minor - this.get('n'))];
          }
        }
      } else {
        for (var j = this.get('n') - (this.get('n') - minor); j > - 1; j--) {
          if (this.get(minor - j)[j]) {
            pieces += this.get(minor - j)[j];
          }
        }
      }

      return pieces > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var anyConflicts = false;
      for (var i = 0; i < 2 * this.get('n') - 1; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          anyConflicts = true;
        }
      }
      return anyConflicts;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
