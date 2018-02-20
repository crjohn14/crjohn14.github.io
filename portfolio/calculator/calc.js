// current equation
var equation = [];
// input to add to equation
var input = [];

$(document).ready(function() {
  
  // when a button is clicked
  // display it's value, and update arrays
  $('button').click(function() {
    // clear button
    if(this.value == 'ac') {
      clearButton();
    } 
    // delete button
    else if(this.value == 'ce') {
      deleteButton();
    } 
    // equals
    else if(this.value == '=') {
      equalButton();
    } 
    // only add digit/decimal/operator if equation isn't too long
    else if (makeString(equation).length < 17) {
      // decimal input
      if(this.value == '.') {
        decimalButton();
      }
      // operator
      else if (this.className == 'operator') {
        operatorButton(this);
      } 
      // digit
      else {
        digitButton(this);
      }
    
    }
    
    // Display cannot exceed 8 digits
    if(makeString(input).length > 8) {
      $('#answer').html('0');
      $('#equation').html('OVERFLOW');
      input = [];
      equation = [];
    }
    
    // check if answer is not a number
    if(valueIsNaN(input[0])) {
      $('#answer').html('NaN');
      input = [];
      equation = [];
    }
  });
  
});

/**
 * Clear button (AC) - reset calc
 * @returns {undefined}
 */
function clearButton() {
  equation = [];
  input = [];
  $('#answer').html('0');
  $('#equation').html('');
}

/**
 * Delete button (CE) - delete last input
 * @returns {undefined}
 */
function deleteButton() {
  // update equation
  equation.pop();

  // update input
  if(makeString(input).length > 1) {
    input.pop();
    $('#answer').html(makeString(input));
  } else {
    if(equation.length > 0) {
      input = [equation[equation.length-1]];
      $('#answer').html(makeString(input));
    } else {
      input = [];
      $('#answer').html('0');
    }
  }
  // display
  $('#equation').html(makeString(equation));
}

/**
 * Equal button (=)
 * Calculates total if last input wasn't an operator
 * @returns {undefined}
 */
function equalButton() {
  // last input wasn't an operator
  if(!operator(equation[equation.length - 1])) {
    // calculate answer
    var temp = calc(equation);
    
    // display values
    $('#answer').html(temp);
    $('#equation').html(makeString(equation) + '=' + temp);
    // reset arrays
    input = [temp];
    equation = [temp];
  }
}

/**
 * Decimal button (.)
 * TODO: using (.) after (=) adds an unwanted 0 before (.) - can't replicate
 * @returns {undefined}
 */
function decimalButton() {
  // get current number
  var nums = makeString(equation).split(/[\*\-\+\/]/);
  var current = nums[nums.length - 1];
  var regex = /\./g;

  // don't allow multiple '.'s
  if(!regex.test(current)) {
    // if last input was an operator or start of equation then start with '0'
    if(operator(equation[equation.length - 1]) || equation.length == 0) {
      // add to input and equation
      input.push('0.');
      $('#answer').html(makeString(input));

      equation.push('0.');
      $('#equation').html(makeString(equation));
    } else {
      // add to input and equation
      input.push('.');
      $('#answer').html(makeString(input));

      equation.push('.');
      $('#equation').html(makeString(equation));
    }
  }
}

/**
 * Operator buttons (+,-,*,/)
 * @param {Object:button} but
 * @returns {undefined}
 */
function operatorButton(but) {
  // last input wasn't an operator and operator cannot start equation
  if(!operator(equation[equation.length - 1]) && equation.length !== 0) {
    // operators are displayed to answer
    $('#answer').html(but.value);

    // reset input
    input = [];

    // build equation
    equation.push(but.value);
    $('#equation').html(makeString(equation));
  }
}

/**
 * Digit buttons (0-9)
 * @param {Object:button} but
 * @returns {undefined}
 */
function digitButton(but) {
  // add another digit to input
  input.push(but.value);
  $('#answer').html(makeString(input));

  // build equation
  equation.push(but.value);
  $('#equation').html(makeString(equation));
}

/**
 * Concatenate an array into a String without spaces
 * @param {Array} arr
 * @returns {String}
 */
function makeString(arr) {
  var s = '';
  for(var i = 0; i < arr.length; i++) {
    s += arr[i];
  }
  return s;
}

/**
 * Returns true if c is an operator
 * @param {type} c
 * @returns {bool}
 */
function operator(c) {
  return /[\*\-\+\/]/.test(c);
}

/**
 * Check if input is not a number (NaN)
 * @param {Object} v
 * @returns {Boolean}
 */
function valueIsNaN(v) { 
  return v !== v; 
}

/**
 * Calculate the total from the equation array (= button)
 * @param {Array} eqn
 * @returns {Number} 
 */
function calc(eqn) {
  // collect all numbers
  var nums = makeString(eqn).split(/[\*\-\+\/]/);
  // collect all operators
  var ops = makeString(eqn).match(/([\*\-\+\/])/g);
  
  var total = Number(nums[0]);
  // loop through operators
  for(var i = 0; i < ops.length; i++) {
    // addition
    if(ops[i] == '+') {
      total += Number(nums[i+1]);
    }
    // subtraction
    else if (ops[i] == '-') {
      total -= Number(nums[i+1]);
    }
    // multiplication
    else if (ops[i] == '*') {
      total *= Number(nums[i+1]);
    }
    // division
    else {
      total /= Number(nums[i+1]);
    }
  }
  
  // if decimal then round to 8 digits
  var l = total.toString().length; // length of ans
  if(l > 8 && /\./g.test(total)) {
    var r = Math.round(total).toString().length; // length before decimal
    
    // only round decimal part if it fits in 8 digits
    if(r > 6) {
      total = round(total, 0);
    } else {
      var dec = 8 - r - 1;
      total = round(total, dec);
    }
  }
  
  return total;
}

/**
 * Round a decimal without floating point errors
 * http://www.jacklmoore.com/notes/rounding-in-javascript/
 * @param {Number} value - to be rounded
 * @param {Integer} decimals - # of decimal places in return
 * @returns {Number}
 */
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}