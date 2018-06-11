$(document).ready(function() {
  
  // set jquery UI autocomplete	
  $('input#search-box').autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + request.term,
        dataType: "jsonp",
        success: function(data) {
          response(data[1]);
        }
      });
    },
    minLength: 3,
    select: function(event, ui) {
      // search for selected topic
      search(ui.item.value);
    }
  });
  
  // when seach is clicked on either open a random page or search wikiMedia
  $("#search-button").click(function() {
    var query = $("#search-box").val();
    if(query == "")
      window.open("https://en.wikipedia.org/wiki/Special:Random");
    else
      search(query);
  });
  
  // when the eye is clicked open a random page
  $("#search-random").click(function() {
      window.open("https://en.wikipedia.org/wiki/Special:Random");
  });
  
});

//'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&list=search&callback=&srsearch=' + query,

// call wikiMedia and update the table of Wiki pages
var search = function(query) {
  $.ajax({
    url: 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&list=search&callback=&srsearch=' + query,
    type: 'GET',
    dataType: 'jsonp',
    headers: { 'Api-User-Agent': 'WikiViewer/0.1'},
    success: function(data) {
      // update table
      updateNum(data);
      updateResults(data);
    },
    error: function(data, status, error) {
      console.log("ERROR: " + status);
    }
  });
};

// update the number of results
var updateNum = function(data) {
  var numResults = data.query.searchinfo.totalhits;
  
  var text = "<p>";
  
  if(numResults >= 10) {
    text += "Showing results 1 to 10 of " + numResults;
  } else {
    text += "Showing results 1 to " + numResults;
  }
  
  text += "</p>";
  
  $("#num-results").html(text);
};

// update the table of wiki pages
var updateResults = function(data) {
  // clear results
  $("#result-table").html('');
  
  var results = data.query.search;
  
  // get page extracts from titles
  var extractQuery = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exsentences=2&exlimit=max&exintro=&explaintext=&titles=";
  
  for(var i = 0; i < results.length - 1; i++) {
    extractQuery += results[i].title + "|";
  }
  
  extractQuery += results[results.length - 1].title;
  
  // encode URL with special chars
  extractQuery = encodeURI(extractQuery);
  
  $.ajax({
    url: extractQuery,
    type: 'GET',
    dataType: 'jsonp',
    headers: { 'Api-User-Agent': 'WikiViewer/0.1'},
    success: function(data) {
      //console.log(data);
      // update table
      buildTable(data);
    },
    error: function(data, status, error) {
      console.log("ERROR: " + status);
    }
  });
};

// write each wiki panel to HTML
var buildTable = function(data) {
  var pages = data.query.pages;
  
  for(var page in pages) {
    var html = '<div class="panel"><a target="_" href="http://en.wikipedia.org/?curid=' + pages[page].pageid + '">';
    html += pages[page].title;
    html += '<p>' + pages[page].extract + '</p></a></div>';
    
    $("#result-table").append(html);
  }
};