$(document).ready(function() {
  // times in seconds
  var workTime;
  var breakTime;
  var elapsedTime = 0;
  
  // T == workTime
  // F == breakTime
  var isWorking = true;
  
  // T == run clock
  // F == stop clock
  var isTiming = false;
  
  // clock interval ID to clear
  var intervalID;
  
  // draw a clock
  var clock = document.getElementById('clock');
  var draw = clock.getContext('2d');
  var radius = clock.height / 2;
  draw.translate(radius, radius); // remap draw position from (0,0) to center
  radius *= 0.9; // reduce radius
  drawFace(draw, radius); // draw initial clock face
  
  // start or stop the timer when start button is clicked
  // sliders determine the break times
  $('#toggle').click(function() {
    // start
    if(!isTiming) {
      // change button text
      $('#toggle').text('Stop');
      $('#toggle').css({'color': '#e01300'});
      // set title and background if reset
      if ($('#title').text() == 'Pomodoro Clock') {
        // set title
        $('#title').html('Work Time!');
        // set background image
        document.getElementById('center').style.backgroundImage="url(https://www.dropbox.com/s/qjb84qudfi77gwj/work.png?raw=1)";
      }
      
      isTiming = true;
      // set workTime (sec)
      workTime = document.getElementById('work').value * 60;
      // set breakTime
      breakTime = document.getElementById('break').value * 60;
      // update clock every second
      intervalID = setInterval(updateClock, 1000); 
    } 
    // stop
    else {
      // change button text
      $('#toggle').text('Start');
      $('#toggle').css({'color': '#01910d'});
      isTiming = false;
      // stop updateClock
      clearInterval(intervalID);
    }
  });
  
  // reset button
  $('#reset').click(function() {
    // reset button
    $('#toggle').text('Start');
    $('#toggle').css({'color': '#01910d'});
    // set title
    $('#title').html('Pomodoro Clock');
    // stop updateClock
    clearInterval(intervalID);
    //set to working and stop timing
    isWorking = true;
    isTiming = false;
    // reset clock face
    drawFace(draw, radius);
    // reset display
    $("#display").html('00:00');
    // reset elapsed time
    elapsedTime = 0;
    // set background image
    document.getElementById('center').style.background="#fff no-repeat fixed center";
  });
  
  /**
   * Updates the clock face and background
   * activated by setInterval
   * @returns {undefined}
   */
  function updateClock() { 
    // determine which time frame
    var totalTime = isWorking ? workTime : breakTime;
    
    // timer completed
    if(elapsedTime > totalTime) {
      // change title 
      if (isWorking) {
        $('#title').html('Break Time!');
        // set background image
        document.getElementById('center').style.backgroundImage="url(https://www.dropbox.com/s/7m6m1t4nn6hdwv4/bank.jpg?raw=1)";
      } else {
        $('#title').html('Work Time!');
        // set background image
        document.getElementById('center').style.backgroundImage="url(https://www.dropbox.com/s/qjb84qudfi77gwj/work.png?raw=1)";
      }
        
      // change timer and reset
      isWorking = isWorking ? false : true;
      // reset time
      elapsedTime = 0;
      // reset clock face
      drawFace(draw, radius);
    } else {
    
      // radians to fill in graphical timer
      var rads = getRads(elapsedTime, totalTime);
      
      // update displays
      drawFace(draw, radius);
      drawTime(draw, radius*0.975, rads, isWorking, elapsedTime, totalTime); // 
      //updateDisplay(elapsedTime, totalTime);
      elapsedTime++;
    }
  }
  
  // range input value bubbles modified from
  // https://css-tricks.com/value-bubbles-for-range-inputs/
  var el, newPoint, newPlace, offset, text;
 
  // Select all range inputs, watch for change
  $("input[type='range']").change(function() {

    // Cache this for efficiency
    el = $(this);

    // Measure width of range input
    width = el.width();

    // Figure out placement percentage between left and right of input
    newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));

    // Janky value to get pointer to line up better
    offset = -6.5;

    // Prevent bubble from going beyond left or right (unsupported browsers)
    if (newPoint < 0) { newPlace = 0; }
    else if (newPoint > 1) { newPlace = width; }
    else { newPlace = width * newPoint + offset; offset -= newPoint; }
    
    if (el.attr('id') == 'break') {
      // write text for output
      text = 'break\n' + el.val() + 'min';
      // set breakTime
      breakTime = document.getElementById('break').value * 60;
      // redraw face if necessary
      if(!isWorking)
        drawFace(draw, radius);
    } else {
      // write text for output
      text = 'work\n' + el.val() + 'min';
      // set workTime (ms)
      workTime = document.getElementById('work').value * 60;
      
      if(isWorking)
        drawFace(draw, radius);
    }
    
    // Move bubble
    el
      .next("output")
      .css({
        left: newPlace,
        marginLeft: offset + "%"
      })
      .text(text);
  })
  // Fake a change to position bubble at page load
  .trigger('change');
  
});

/**
 * Draw the clock face
 * @param {2d canvas} draw
 * @param {Number} radius
 * @returns {undefined}
 */
function drawFace(draw, radius) {
  // white face
  draw.beginPath();
  draw.arc(0, 0, radius, 0, 2*Math.PI);
  draw.fillStyle = '#fff';
  draw.fill();
  
  // draw border
  draw.strokeStyle = '#000';
  draw.lineWidth = radius*0.05;
  draw.stroke();
}

/**
 * Updates the clock canvas
 * A semicircle is drawn to represent the fraction of total time elapsed
 * The time remaining is drawn on top of the semicircle
 * TODO: reduce number of parameters.  Some could be global?
 * @param {2d canvas} draw
 * @param {Number} radius
 * @param {Number} rads
 * @param {bool} isWorking
 * @param {type} time - elapsed time
 * @param {type} total - time to stop
 * @returns {undefined}
 */
function drawTime(draw, radius, rads, isWorking, time, total) {
  // save context
  draw.save();
  
  var startAngle = 1.5 * Math.PI;
  var endAngle = startAngle + rads; // in radians; 30deg = Pi/6 rad, 180deg = Pi rad
  
  // determine minutes and seconds based on time in seconds
  var temp = total - Math.round(time); // total seconds
  
  var min = Math.floor(temp / 60);
  var sec = temp % 60;
  
  var minStr, secStr; // strings to display
  
  if(min.toString().length == 1) {
    minStr = '0' + min;
  } else {
    minStr = min.toString();
  }
  
  if(sec.toString().length == 1) {
    secStr = '0' + sec;
  } else {
    secStr = sec.toString(); 
  }
  
  // draw time arc
  draw.beginPath();
  draw.moveTo(0, 0);
  draw.arc(0, 0, radius, startAngle, endAngle);
  draw.closePath();
  // color chages from work to break
  draw.fillStyle = isWorking ? '#ff8f17' : '#1e768f';
  draw.fill();
  
  //draw clock digits
  draw.font = '80px VT323';
  draw.fillStyle = 'black';
  draw.textAlign = 'center';
  draw.fillText(minStr + ':' + secStr, 0, 20);
  
  // restore context
  draw.restore();
}


/**
 * Returns radians of a circle given the current and total time in seconds
 * @param {Integer} curr
 * @param {Integer} total
 * @returns {Number}
 */
function getRads(curr, total) {
  return (curr / total) * 2 * Math.PI;
}
