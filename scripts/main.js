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
      this.getType = function() { return _type; };
      this.getType_2 = function() { return _type_2; };

      this.setTab = function(tab) { 
        _tab = tab;
      }

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
      }

    };

    return tab;
  
  })();
 

  Spotitar = (function() {

    var _Tabs = [],
        _models,
        _tabArea = $('#tab-area');

    var createTabs = function(data) {
      _Tabs = [];
      var results = $(data).find('results').attr('count');
      if(results > 0) {
        $(data).find('result').each(function() {
          var tab = new Tab($(this).attr('id'),
                            $(this).attr('name'),
                            $(this).attr('url'),
                            $(this).attr('version'),
                            $(this).attr('type'),
                            $(this).attr('type_2'));
          _Tabs.push(tab);
        });
        _Tabs[0].render();
      }
    }

    var fetchTabs = function() {
      var throbber = Throbber.forElement(_tabArea[0]);
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

    var createSearchString = function() {
      var from = "åÅäÄöÖéÉ";
      var to   = "aAaAoOeE";
      var pattern = new RegExp("["+from+"]", "g");
      var str = models.player.track.artists[0].name + " " + models.player.track.name;
      str = str.replace(pattern, function(ch) { return to[from.indexOf(ch)]; } );
      return str.replace(/ /g, '+').replace(/&/g, 'and');
    }

    var application = {
      init: function() {
        fetchTabs();
      },
      updateCurrentTrack: function() {
        _tabArea.text('');
        $("#track-header").text(models.player.track.artists[0].name + " - " + models.player.track.name);
        fetchTabs();
      },
      getTabs: function() {
        return _Tabs;
      }
    }
    return application;

  })();



  // Get the currently-playing track
  models.player.load('track').done(Spotitar.updateCurrentTrack);

  // Update the DOM when the song changes
  models.player.addEventListener('change:track', Spotitar.updateCurrentTrack);

  Spotitar.init();


});
