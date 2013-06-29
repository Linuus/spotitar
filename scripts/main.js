require([
  '$api/models',
], function(models) {
  'use strict';
  // Get the currently-playing track
  models.player.load('track').done(updateCurrentTrack);
  // Update the DOM when the song changes
  models.player.addEventListener('change:track', updateCurrentTrack);

  function updateCurrentTrack() {
    updateTrackHeader();
    updateTab();
  }

  function updateTrackHeader() {
    var currentTrackEl = $("#track-header");
    if(models.player.track == null) {
      currentTrackEl.text('No tracks is playing');
    } else {
      var artists = models.player.track.artists;
      var artists_array = [];
      for(var i=0; i<artists.length; i++) {
        artists_array.push(artists[i].name);
      }
      currentTrackEl.text(artists_array.join(', ') + " - " + models.player.track.name);
    }
  }

  function updateTab() {
    var search = createSearchString();
    getData("http://app.ultimate-guitar.com/search.php?search_type=title&page=1&iphone=1&value="+search, 'xml', fetchTab);
  }

  function createSearchString() {
    var from = "åÅäÄöÖ";
    var to   = "aAaAoO";
    var pattern = new RegExp("["+from+"]", "g");
    var str = models.player.track.artists[0].name + " " + models.player.track.name;
    str = str.replace(pattern, function(ch) { return to[from.indexOf(ch)]; } );
    return str.replace(/ /g, '+').replace(/&/g, 'and');
  }

  function fetchTab(data) {
    var results = $(data).find('results').attr('count');
    if(results > 0) {
      var res = $(data).find('result:first');
      getData($(res).attr('url'), 'html', displayTab);
    } else {
      $("#tab-area").text("No tab was found");
    }
  }

  function displayTab(data) {
    $("#tab-area").html(data);
  }

  function getData(url, dataType, callback) {
    console.log("getData");
    $.ajax({
      url: url,
      dataType: dataType,
      success: function(data) {
        callback(data);
      },
      error: function(data) {
        console.log("Error");
      }
    });
  }


});
