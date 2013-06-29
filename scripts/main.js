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
    var search = models.player.track.artists[0].name + " " + models.player.track.name;
    search = search.replace(/&/g, 'and');
    search = search.replace(/ /g, '+');
    getData("http://app.ultimate-guitar.com/search.php?search_type=title&page=1&iphone=1&value="+search, 'xml', fetchTab);
  }

  function fetchTab(data) {
    var res = $(data).find('result:first');
    getData($(res).attr('url'), 'html', displayTab);
  }

  function displayTab(data) {
    $("#tab-area").html(data);
  }

  function getData(url, dataType, callback, error) {
    $.ajax({
      url: url,
      dataType: dataType,
      success: function(data) {
        console.log("Success");
        callback(data);
      },
      error: function(data) {
        console.log("Error");
      }
    });
  }


});
