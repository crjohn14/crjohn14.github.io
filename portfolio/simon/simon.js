/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// array to hold button sequence
// 0 = green
// 1 = red
// 2 = yellow
// 3 = blue
var simonSequence = [];

// record where in the sequence when player presses buttons
var sequencePosition;

// holds timeout IDs
var timeoutArray = [];
var resetTimeout;

// Defines how far in the sequence the player has reached
var playerTurn;

// player mistake resets the game with new sequence
var strict;

// button sounds
var sounds = {
    green: new Audio('https://www.dropbox.com/s/gcqbfqqgefco7nb/simonSound1.mp3?raw=1'),
    red: new Audio('https://www.dropbox.com/s/ihr5yz94gnest30/simonSound2.mp3?raw=1'),
    yellow: new Audio('https://www.dropbox.com/s/jdmh2py60sf3kc7/simonSound3.mp3?raw=1'),
    blue: new Audio('https://www.dropbox.com/s/kssv2xkbcz0k4fo/simonSound4.mp3?raw=1'),
    error: new Audio('https://www.dropbox.com/s/73b2jhs67v62ih8/error.mp3?raw=1')
};

$(document).ready(function() {
    // initialize
    initGame();

    //on/off switch
    $("#poweronoff").change(function() {
        if ($(this).is(':checked')) {
            $('.small-but').removeClass('unclickable').addClass('clickable');
        } else {
            $('.small-but').removeClass('clickable').addClass('unclickable');
            $('.simon-but').removeClass('clickable').addClass('unclickable');
            resetGame()
        }
    });

    //strict switch
    $("#strictonoff").change(function() {
        if ($(this).is(':checked')) {
            strict = true;
        } else {
            strict = false;
        }
    });

    // start button
    $("#start").click(function() {
        resetGame();
        $('.simon-but').removeClass('unclickable').addClass('clickable');
        nextTurn();
    });
  
    // simon buttons
    $(".simon-but").click(function() {
        $('.simon-but').removeClass('clickable').addClass('unclickable');
        clearTimeout(resetTimeout);
        resetTimer();
        var val = Number($(this).attr('data-value'));
        if(simonSequence[sequencePosition] == val) {
            rightAnswer(val);
        }
        else {
            wrongAnswer();
        }
    });
});

/**
 * Prepare for next turn
 * @returns {undefined}
 */
function nextTurn() {
    clearTimeout(resetTimeout);
    if (playerTurn == 20) {
        // You win
        $('.scoreboard').css('text-align', 'center').css('padding-left', '0px').html('YOU WIN !');
    } else {
        sequencePosition = 0;
        playerTurn++;
        displayLevel();
        showSequence();
    }
}

/**
 * Display level on scoreboard
 */
function displayLevel() {
    msg = '';
    for (var i = 0; i < playerTurn; i++) {
        msg += 'I';
    }
    $('.scoreboard').html(msg);
}

/**
 * Initialize game when page loads
 */
function initGame() {
    $('#poweronoff').prop('checked', false);
    $('#strictonoff').prop('checked', false);
    simonSequence = [];
    playerTurn = 0;
    sequencePosition = 0;
    strict = $('input[name=strictonoff]').checked ? true : false;
    $('.scoreboard').html('');
}

/**
 * Prepare for the next game
 */
function resetGame() {
    // initialize variables
    simonSequence = [];
    playerTurn = 0;
    sequencePosition = 0;
    $('.top-left').removeClass('green-light').addClass('green');
    $('.top-right').removeClass('red-light').addClass('red');
    $('.bot-left').removeClass('yellow-light').addClass('yellow');
    $('.bot-right').removeClass('blue-light').addClass('blue');
  
    // reset display of turn
    $('.scoreboard').css('padding-left', '8px').css('text-align','left');
    $('.scoreboard').html('');

    // fill buttonPattern array
    for (var i = 0; i < 20; i++) {
        var ran = Math.floor(Math.random() * 4); // random integer [0,3]
        simonSequence.push(ran); // push to array
    }

    // clearTimeout before emptying array
    clearTimeout(resetTimeout);
    for(var i = 0; i < timeoutArray.length; i++) {
        clearTimeout(timeoutArray[i]);
    }
    timeoutArray = [];
}

/**
 * Lights up the buttons according to simonSequence until playerTurn
 * @returns {undefined}
 */
function showSequence() {
    // turn off button interaction
    $('.simon-but').removeClass('clickable').addClass('unclickable');
    clearTimeout(resetTimeout);
    // loop through simonSequence until playerTurn
    for (var i = 0; i < playerTurn; i++) {
        switch(simonSequence[i]) {
            case 0: // green
                buttonBlink($('#grn-but'), i, 'green');
                break;
            case 1: // red
                buttonBlink($('#red-but'), i, 'red');
                break;
            case 2: // yellow
                buttonBlink($('#yel-but'), i, 'yellow');
                break;
            case 3: // blue
                buttonBlink($('#blu-but'), i, 'blue');
                break;
        }
    }
  
    // turn on button interaction after buttons finish blinking
    timeoutArray.push(setTimeout(function() {
        $('.simon-but').removeClass('unclickable').addClass('clickable');
        resetTimer();
    }, 1000 * playerTurn));
}

/**
 * Change the button's color to bright then back to dark
 * timeout IDs are stored in case game is reset
 * @param {Object:button} but - object to change css
 * @param {Integer} i - position in button sequence
 * @param {String} color - button color
 * @returns {undefined}
 */
function buttonBlink(but, i, color) {
    var delay = i * 1000;
    timeoutArray.push(setTimeout(function() {
        but.removeClass(color).addClass(color + '-light');
        sounds[color].play();
    }, delay));
    timeoutArray.push(setTimeout(function() {
        but.removeClass(color + '-light').addClass(color);
    }, delay + 500));
}

/**
 *
 */
function resetTimer() {
    resetTimeout = setTimeout(function() { wrongAnswer(); }, 6000);
}

/**
 *
 * @param val
 */
function rightAnswer(val) {
    switch(val) {
        case 0: // green
            buttonBlink($('#grn-but'), 0, 'green');
            break;
        case 1: // red
            buttonBlink($('#red-but'), 0, 'red');
            break;
        case 2: // yellow
            buttonBlink($('#yel-but'), 0, 'yellow');
            break;
        case 3: // blue
            buttonBlink($('#blu-but'), 0, 'blue');
            break;
    }
    if(playerTurn == sequencePosition + 1) {
        clearTimeout(resetTimeout);
        timeoutArray.push(setTimeout(function() {
            nextTurn();
        }, 1500));
    } else {
        sequencePosition++;
        $('.simon-but').removeClass('unclickable').addClass('clickable');
    }
}

/**
 *
 */
function wrongAnswer() {
    $('.simon-but').removeClass('clickable').addClass('unclickable');
    clearTimeout(resetTimeout);
    sounds['error'].play();
    $('.scoreboard').html('!!!!!!!!!!!!!!!!!!!!');
    if(strict) {
        timeoutArray.push(setTimeout(function() {
            resetGame();
            nextTurn();
        }, 2500));
    } else {
        timeoutArray.push(setTimeout(function() {
            displayLevel();
            sequencePosition = 0;
            showSequence();
        }, 1500));
    }
}