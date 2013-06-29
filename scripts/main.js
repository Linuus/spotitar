require([
  '$api/models',
  '$views/buttons',
  '$views/throbber#Throbber',
  '$views/popup'
], function(models, buttons, Throbber, popup) {
  'use strict';

  // Get the currently-playing track
  models.player.load('track').done(updateCurrentTrack);
  // Update the DOM when the song changes
  models.player.addEventListener('change:track', updateCurrentTrack);

  var Tracks = [];

  function updateCurrentTrack() {
    Tracks = [];
    $("#tab-area").text('');
    updateTrackHeader();
    createVersionsButton();
    updateTab();
  }

  function createVersionsButton() {
    if($(".versions-button").size() == 0) {
      var btn = buttons.CustomButton.withClass('versions-button');
      btn.setLabel("Versions");
      btn.setAccentuated(true);
      $('#top-bar .versions-button-wrapper').append(btn.node);
    }
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
    getData("http://app.ultimate-guitar.com/search.php?search_type=title&page=1&iphone=1&value="+search, 'xml', fetchTabs);
  }

  function createSearchString() {
    var from = "åÅäÄöÖ";
    var to   = "aAaAoO";
    var pattern = new RegExp("["+from+"]", "g");
    var str = models.player.track.artists[0].name + " " + models.player.track.name;
    str = str.replace(pattern, function(ch) { return to[from.indexOf(ch)]; } );
    return str.replace(/ /g, '+').replace(/&/g, 'and');
  }

  function fetchTabs(data) {
    var results = $(data).find('results').attr('count');
    if(results > 0) {
      $(data).find('result').each(function() {
        Tracks.push({
          id: $(this).attr('id'),
          name: $(this).attr('name'),
          url: $(this).attr('url'),
          version: $(this).attr('version'),
          type: $(this).attr('type'),
          type_2: $(this).attr('type_2')
        });
      });
      displayTab(Tracks[0]);
    } else {
      renderTab("No tracks were found");
    }
  }

  function displayTab(track) {
    getData(track.url, 'html', renderTab);
  }

  function renderTab(tab) {
    var formatted = formatTab(tab);
    $("#tab-area").html(formatted);
    
  }

  function formatTab(tab) {
    var nTab = tab.replace(/\[ch\]/g, '<span class="chord">');
    nTab = nTab.replace(/\[\/ch\]/g, "</span>");
    return nTab;
  }

  function getData(url, dataType, callback) {
    var tabArea = document.getElementById('tab-area');
    var throbber = Throbber.forElement(tabArea);
    $.ajax({
      url: url,
      dataType: dataType,
      success: function(data) {
        throbber.hide();
        callback(data);
      },
      error: function(data) {
        console.log("Error");
      }
    });
  }


});
