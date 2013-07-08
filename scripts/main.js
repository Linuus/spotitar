var Spotitar;

require([
  '$api/models',
  '$views/buttons',
  '$views/throbber#Throbber',
  '$views/popup'
], function(models, buttons, Throbber, popup) {
  'use strict';


  var Tab = (function() {

    var tab = function(id, name, url, version, type, type_2) {

      var _id = id,
          _name = name,
          _url = url,
          _version = version,
          _type = type,
          _type_2 = type_2,
          _tab = null;
      
      
      var formatTab = function(tab) {
        var nTab = tab.replace(/\[ch\]/g, '<span class="chord">');
        nTab = nTab.replace(/\[\/ch\]/g, "</span>");
        return nTab;
      }
      
      
      this.getId = function() { return _id; };
      this.getName = function() { return _name; };
      this.getUrl = function() { return _url; };
      this.getVersion = function() {
        return "Version " + _version;
      };
      this.getType = function() { return _type; };
      this.getType_2 = function() { return _type_2; };

      this.setTab = function(tab) { 
        _tab = tab;
      }

      var versionLink = $('<a/>');
      versionLink.attr('href', '#');
      versionLink.text(this.getVersion() + " [" + this.getType() + "]");
      var that = this;
      versionLink.on('click', function(e) {
        that.render();
      });
      versionListContainer.appendChild(versionLink[0]);

      this.getTab = function() {
        var that = this;
        if(_tab === null) {
          $.ajax({
            url: _url,
            dataType: 'html',
            async: false
          }).done(function(data) {
            that.setTab(data);
          });
        }
        return formatTab(_tab);
      }

      this.render = function() {
        $('#tab-area').html(this.getTab());
        $('#version-list a').each(function(i, el) {
          el.setAttribute('class', '');
        });
        versionLink.attr('class', 'active');
      }

    };

    return tab;
  
  })();


  var tabs = {},
      numberOfTabs = 0,
      tabArea = $('#tab-area'),
      versionsBtn = buttons.Button.withLabel("Versions");
    
  $('.versions-button-wrapper').append(versionsBtn.node);

  var versionListContainer = document.createElement('div');
  versionListContainer.setAttribute('id', 'version-list');
  
  var versionsPopup = popup.Popup.withContent(versionListContainer, 150, 150);
  $('.versions-button-wrapper button').on('click', function(){
    versionsPopup.showFor(this);
  });

  function createTabs(data) {
    tabs = {};
    var results = $(data).find('results').attr('count');
    if(results > 0) {
      $(data).find('result').each(function() {
        var tab = new Tab($(this).attr('id'),
                          $(this).attr('name'),
                          $(this).attr('url'),
                          $(this).attr('version'),
                          $(this).attr('type'),
                          $(this).attr('type_2'));
        tabs[tab.getId()] = tab;
        numberOfTabs++;
      });
      renderTab();
      versionsPopup.resize(150, numberOfTabs*25);
    }
  }

  function renderTab(tabId) {
    if(tabId) {
      tabs[tabId].render();
    } else {
      for(var t in tabs) {
        tabs[t].render();
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
