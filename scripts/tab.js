/**
 * Tab module
 */

require([
  '$api/models'
], function(models) {
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
      

      var versionLink = $('<a/>');
      versionLink.attr('href', '#');
      versionLink.text("Version " + _version + " [" + _type + "]");
      if(_type_2) { versionLink.text(versionLink.text() + " (" + _type_2 + ")"); }
      
      var formatTab = function(tab) {
        var nTab = tab.replace(/\[ch\]/g, '<span class="chord">');
        nTab = nTab.replace(/\[\/ch\]/g, "</span>");
        return nTab;
      };
      
      
      this.getId = function() { return _id; };

      this.getVersionLink = function() {
        var that = this;
        versionLink.on('click', function(e) {
          that.render();
        });
        return versionLink;
      };

      this.setTab = function(tab) { 
        _tab = tab;
      };


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
      };

      this.render = function() {
        $('#tab-area').html(this.getTab());
        $('#version-list a.active').each(function(i, el) {
          el.setAttribute('class', '');
        });
        versionLink.attr('class', 'active');
        //scroller();
      }

    };

    return tab;
  
  })();

  exports.Tab = Tab;

});
