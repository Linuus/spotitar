
require([
  '$api/models',
  '$views/buttons',
  '$views/throbber#Throbber',
  '$views/popup',
  'scripts/tab#Tab'
], function(models, buttons, Throbber, popup, Tab) {
  'use strict';



  var scrollSpeed = 0;
  function scroller() {
    $('body,html').animate({scrollTop: $(document).height()-$(window).height()}, models.player.track.duration);
  }

  var tabs = {},
      numberOfTabs = 0,
      tabArea = $('#tab-area'),
      versionsBtn = buttons.Button.withLabel("Versions");
    
  $('.versions-button-wrapper').append(versionsBtn.node);

  var versionListContainer = document.createElement('div');
  versionListContainer.setAttribute('id', 'version-list');
  
  var versionsPopup = popup.Popup.withContent(versionListContainer, 180, 150);
  $('.versions-button-wrapper button').on('click', function(){
    versionsPopup.showFor(this);
  });

  function createTabs(data) {
    tabs = {};
    numberOfTabs = 0;
    versionListContainer.innerHTML = '';
    var results = $(data).find('results').attr('count');
    if(results > 0) {
      $(data).find('result').each(function() {
        if($(this).attr('type_2') != 'album') {
          var tab = new Tab($(this).attr('id'),
                            $(this).attr('name'),
                            $(this).attr('url'),
                            $(this).attr('version'),
                            $(this).attr('type'),
                            $(this).attr('type_2'));
          tabs[tab.getId()] = tab;
          versionListContainer.appendChild(tab.getVersionLink()[0]);
          numberOfTabs++;
        }
      });
      versionsPopup.resize(180, numberOfTabs*25);
    }
    renderTab();
  }

  function renderTab(tabId) {
    if(numberOfTabs == 0) {
      $('#no-tab-found').show();
    } else if(tabId) {
      $('#no-tab-found').hide();
      tabs[tabId].render();
    } else {
      for(var t in tabs) {
        tabs[t].render();
        $('#no-tab-found').hide();
        break;
      }
    }
  }

  function fetchTabs() {
    var throbber = Throbber.forElement(tabArea[0]);
    $.ajax({
      url: "http://app.ultimate-guitar.com/search.php?search_type=title&page=1&iphone=1&value="+createSearchString(),
      dataType: 'xml'
    }).done(function(data){
      throbber.hide();
      createTabs(data);
    }).fail(function(){
      console.log("Error");
    });
  }

  function createSearchString() {
    var from = "åÅäÄöÖéÉ";
    var to   = "aAaAoOeE";
    var pattern = new RegExp("["+from+"]", "g");
    var str = models.player.track.artists[0].name + " " + models.player.track.name;
    str = str.replace(pattern, function(ch) { return to[from.indexOf(ch)]; } );
    return str.replace(/ /g, '+').replace(/&/g, 'and');
  }


  function updateCurrentTrack() {
    $('#tab-area').text('');
    $("#track-header").text(models.player.track.artists[0].name + " - " + models.player.track.name);
    fetchTabs();
  }


  // Get the currently-playing track
  models.player.load('track').done(updateCurrentTrack);

  // Update the DOM when the song changes
  models.player.addEventListener('change:track', updateCurrentTrack);

});
