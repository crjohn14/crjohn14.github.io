
// array to check if a player has won
var winCondition = [[1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9],
                    [1, 4, 7],
                    [2, 5, 8],
                    [3, 6, 9],
                    [1, 5, 9],
                    [3, 5, 7]];

// 1 player, computer difficulty
var easyMode = false;

// toggle start / new game button
var gameOn = false;

// T == X is playing
var isXTurn;

// if gameOver then reset board (boolean)
var gameOver;

// toggle when board can be marked (boolean)
var canMark;
  
// player scores; # of games won
var score1, score2, drawScore;

// arrays to hold X/O locations
var XBoxes, OBoxes, allBoxes;

// stores the number of players, what mark is for player 1, and # of games to win match
var numPlayers = 2;
var firstMark = 'X';

$(document).ready(function() {
  
  // whenever a board position is clicked
  $('.position').click(function() {
    if(canMark) {
      // 2 player
      if (numPlayers == 2) { 
        markBoard($(this));
        checkEndState();
        prepNextGame();
      } 
      // vs AI
      else {  
        markBoard($(this));
        checkEndState();

        if(!gameOver) {
          moveAI(); 
        } 
        
        prepNextGame();
      }
    }
  });
  
  // Start Game/New Game button
  // Switch between options menu and playing the game
  $('#toggle').click(function() {
    // game in progress
    if(gameOn) {
      gameOn = false;
      canMark = false;
      $('.buttons').css('display', 'none');
      $('#options').css('display', 'inline');
      $(this).text('Start Game');
      $('.message').html('Select Options');
    } 
    // options menu
    else {
      gameOn = true;
      canMark = true;
      $('#options').css('display', 'none');
      $('.buttons').css('display', 'inline-block');
      $(this).text('New Game');
      newGame();
    }
  });
  
  // update number of players
  $('#playerForm input').on('change', function() {
    num = $('input[name=num_players]:checked', '#playerForm').val();
    if(num == 1) {
      $('#diffForm').css('display', 'inline');
      $('#markMessage').html('Select your mark:');
    } else {
      $('#diffForm').css('display', 'none');
      $('#markMessage').html("Select player 1's mark:");
    }
  });
  
});

/**
 * Check if game was won after last move
 * If so reset game after 2.5s and prevent marking board
 * @returns {undefined}
 */
function prepNextGame() {
  if(gameOver) {
    canMark = false;  // don't allow marks during timeout
    setTimeout(function() { // timeout to display winner
      whoIsNext();
      resetGame();
    }, 2500);
  }
}

/**
 * Display a message for who's turn is next
 * @returns {undefined}
 */
function whoIsNext() {
  if(isXTurn) 
    $('.message').html('X\'s turn');
  else 
    $('.message').html('O\'s turn');
}

/**
 * Mark the board if that position is empty
 * @param {Object} but - last board position clicked
 * @returns {undefined}
 */
function markBoard(but) {
  // make sure box is empty
  if (but.text() == '') {
    if (isXTurn) {
      but.text('X');  // mark the box
      // update arrays for later calculations
      XBoxes.push(Number(but.val())); 
      allBoxes.push(Number(but.val()));
      XBoxes.sort();
      isXTurn = false;  // switch turns
      whoIsNext(); // display who's turn it is
    } else {
      but.text('O');
      OBoxes.push(Number(but.val()));
      allBoxes.push(Number(but.val()));
      OBoxes.sort();
      isXTurn = true;
      whoIsNext();
    }
  }
}

/**
 * Prepare for next match, reset scores, set options, start first game
 * @returns {undefined}
 */
function newGame() {
  score1 = 0;
  score2 = 0;
  drawScore = 0;
  $('.score-val').text('0');
  
  // set variables from options menu
  var diff = $('input[name=difficulty]:checked', '#diffForm').val();
  easyMode = (diff == 'easy') ? true : false;
  numPlayers = $('input[name=num_players]:checked', '#playerForm').val();
  firstMark = $('input[name=first_mark]:checked', '#markForm').val();
  isXTurn = (firstMark == 'X') ? true : false;
  
  resetGame();
}

/**
 * Reset the board, initialize variable for next game
 * Allow AI to move first if player won last game
 * @returns {undefined}
 */
function resetGame() {
  // reset vars
  XBoxes = [];
  OBoxes = [];
  allBoxes = [];
  canMark = true;
  gameOver = false;
  
  // reset boxes
  $(".position").each(function() {
    $(this).text('');
  });
  
  // AI moves first if player won
  if(numPlayers == 1 && (firstMark == 'X' && !isXTurn) || (firstMark == 'O' && isXTurn)) {
    moveAI();
  }
  
  whoIsNext();
}

/**
 * Check if the player who moved last has won the game
 * @returns {undefined} true if current player wins, else false
 */
// check for win or draw
function checkEndState() {
  // Did X just win?
  if (!isXTurn) {
    // check for win
    if (checkWin(XBoxes)) {
      gameOver = true;
      $('.message').html('X wins!');
      // increment X score
      if(firstMark == 'X') {
        score1++;
        $('#player1Score').text(score1);
      } else {
        score2++;
        $('#player2Score').text(score2);
      }
    }
  } 
  // Did O just win?
  else {
    if (checkWin(OBoxes)) {
      gameOver = true;
      $('.message').html('O wins!');
      // increment O score
      if(firstMark !== 'X') {
        score1++;
        $('#player1Score').text(score1);
      } else {
        score2++;
        $('#player2Score').text(score2);
      }
    }
  }
  
  // if all spaces full: cat's game
  if (allBoxes.length == 9 && gameOver == false) {
    drawScore++;
    $('#drawScore').text(drawScore);
    $('.message').html("Cat's Game...");
    gameOver = true;
  }
}

/**
 * Compare player marks to win conditions
 * @param {Array[Number]} marks
 * @returns {Boolean} true if current player wins, else false
 */
function checkWin(marks) {
  // you can't win without 3 marks
  if (marks.length < 3)
    return false;
  
  // iterate through win conditions
  for (var i = 0; i < 8; i++) {
    var line = winCondition[i];
    var m, l, tally = 0;
    for (m = 0, l = 0; m < marks.length, l < line.length;) {
      if (marks[m] < line[l]) {
        m++;
      } else if (marks[m] == line[l]) {
        m++; l++; tally++; // advance and record a match to part of a win condition
      } else {
        break;
      }
    }
    if (tally >= 3) // full match of win condition
      return true;
  }
  return false;
}

// computer chooses a random spot that isn't occupied
// Assume only children play tic tac toe
function moveAI() {
  // easy mode
  if(easyMode) {
    // pick a random square, check if occupied, if not then move there
    var done = false;
    var ran;
    do {
      ran = Math.floor(Math.random() * 9) + 1;
      console.log(ran);
      if (allBoxes.indexOf(ran) === -1) {
        done = true;
      }
    } while (!done);
    
    waitThenMoveAI(ran);
  } 
  // hard mode
  else {
    // determine which marks are human and computer
    var humanMarks = (firstMark == 'X') ? XBoxes: OBoxes;
    var compMarks = (firstMark == 'X') ? OBoxes: XBoxes;
    
    // check if comp can win next turn
    var compWinPos = winNextTurn(compMarks, humanMarks);
    // check if human can win next turn
    var humWinPos = winNextTurn(humanMarks, compMarks);
    
    // if comp can win, then win!
    if (compWinPos !== -1) {
      waitThenMoveAI(compWinPos);
    } 
    // if human can win, steal his win position
    else if (humWinPos !== -1) {
      waitThenMoveAI(humWinPos);
    } 
    // nobody can win next turn
    else {
      // if comp never moved, go middle
      if (compMarks.length == 0) {
        if (allBoxes.indexOf(5) == -1) {
          waitThenMoveAI(5);
        }
        // else move random
        else {
          // pick a random square, check if occupied, if not then move there
          var done = false;
          var ran;
          do {
            ran = Math.floor(Math.random() * 9) + 1;
            if (allBoxes.indexOf(ran) === -1) {
              done = true;
            }
          } while (!done);
          
          waitThenMoveAI(ran)
        }
      }
      // if comp has moved, pick a position that could win
      else {
        waitThenMoveAI(compNextMove(humanMarks, compMarks));
      }
    }
  }
}

/**
 * Move AI to position pos after 1s, player may not move during this time
 * @param {Number} pos
 * @returns {undefined}
 */
function waitThenMoveAI(pos) {
  canMark = false;  // don't allow marks during timeout
  setTimeout(function() { // timeout to display winner
    markBoard($('#pos-' + pos));
    checkEndState();
    prepNextGame();
    canMark = true;
  }, 1000);
}

/**
 * Determine the next position the AI will move
 * TODO: favor corners (could make it unbeatable, insane difficulty?)
 * TODO: move to a position with multiple paths to victory
 * @param {Array[Number]} playerBoxes - Where player has marked
 * @param {Array[Number]} compBoxes - Where AI has marked
 * @returns {Number} Position AI will move next 
 */
function compNextMove(playerBoxes, compBoxes) {
  var nextMove;
  var inARow = 0;
  
  // iterate through win conditions
  for (var i = 0; i < 8; i++) {
    var line = winCondition[i];
    var m, l, tally = 0;
    for (m = 0, l = 0; m < compBoxes.length, l < line.length;) {
      if (compBoxes[m] < line[l]) {
        m++;
      } else if (compBoxes[m] == line[l]) {
        m++; l++; tally++;
      } else {
        l++;
      }
    }
    // when win condition is found return win position
    if (tally > 0) {
      for (var j = 0; j < 3; j++) {
        if (playerBoxes.indexOf(line[j]) == -1 && compBoxes.indexOf(line[j]) == -1 && tally > inARow) {
          nextMove = line[j];
          inARow = tally;
          break;
        } 
      }
    }
  }
  
  return nextMove;
}

/**
 * Check if the player can win on the next move
 * @param {type} playerBoxes
 * @param {type} compBoxes
 * @returns {Number} position of winning move or -1 if the player cannot win
 */
function winNextTurn(playerBoxes, compBoxes) {
  // player cannot win next turn with less than 2 marks
  if (playerBoxes.length < 2)
    return -1;
  
  // iterate through win conditions
  for (var i = 0; i < 8; i++) {
    var line = winCondition[i];
    var m, l, tally = 0;
    for (m = 0, l = 0; m < playerBoxes.length, l < line.length;) {
      if (playerBoxes[m] < line[l]) {
        m++;
      } else if (playerBoxes[m] == line[l]) {
        m++; l++; tally++;
      } else {
        l++;
      }
    }
    // when win condition is found return win position
    if (tally >= 2) {
      for (var j = 0; j < 3; j++) {
        if (playerBoxes.indexOf(line[j]) == -1 && compBoxes.indexOf(line[j]) == -1)  
          return line[j];
      }
    }
  }
  return -1;
}