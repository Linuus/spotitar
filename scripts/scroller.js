require([
  '$api/models'
], function(models) {
  'use strict';

  var scrollDuration = null;
  var isScrolling = false;
  var viewport = $('body,html');

  function scroll() {
    viewport.animate(
      {
        scrollTop: $(document).height()-$(window).height()
      },
      {
        duration: scrollDuration,
        easing: 'linear'
      }
    );
    isScrolling = true;
    $('#toggle-scroll').text('Stop');
  }

  function start() {
    viewport.stop(); // Remove old animations
    scrollDuration = models.player.track.duration;
    if(models.player.playing) {
      scroll();
    }
  }

  function halt() {
    viewport.stop();
    isScrolling = false;
    $('#toggle-scroll').text('Start');
  }

  function toggleScroll() {
    if(isScrolling) {
      halt();
    } else {
      scroll();
    }
  }

  function increase() {
    viewport.stop();
    scrollDuration = scrollDuration * 0.9;
    scroll();
  }

  function decrease() {
    viewport.stop();
    scrollDuration = scrollDuration * 1.1;
    scroll();
  }

  function trackChanged() {
    if(models.player.playing && !isScrolling) {
      scroll();
    } else if(!models.player.playing) {
      halt();
    }
  }

  // This turns autoscroll off when the user scrolls manually. Otherwise the animation
  // makes it impossible to scroll without manually stopping the autscroller first
  viewport.bind("scroll DOMMouseScroll mousewheel", function(e){
    if (isScrolling && ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel" )){
      halt();
    }
  });


  $('#less-scroll').on('click', function(e) {
    e.preventDefault();
    decrease();
  });
  $('#more-scroll').on('click', function(e) {
    e.preventDefault();
    increase();
  });
  $('#toggle-scroll').on('click', function(e) {
    e.preventDefault();
    toggleScroll();
  });

  models.player.addEventListener('change', trackChanged);

  exports.start = start;
});
