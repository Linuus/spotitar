require([
  '$api/models'
], function(models) {
  'use strict';

  var scrollSpeed = 0;
  var isScrolling = false;

  function scroll() {
    $('body,html').animate(
      {
        scrollTop: $(document).height()-$(window).height()
      },
      {
        duration: scrollSpeed,
        easing: 'linear'
      }
    );
    isScrolling = true;
  }

  function start() {
    scrollSpeed = models.player.track.duration;
    if(models.player.playing) { scroll(); }
  }

  function stop() {
    $('body,html').stop();
    isScrolling = false;
  }

  function increase() {
    stop();
    scrollSpeed = scrollSpeed * 0.9;
    scroll();
  }

  function decrease() {
    stop();
    scrollSpeed = scrollSpeed * 1.1;
    scroll();
  }

  function trackChanged() {
    if(models.player.playing && !isScrolling) {
      start();
    } else if(!models.player.playing) {
      stop();
    }
  }

  $('#less').on('click', function(e) {
    e.preventDefault();
    decrease();
  });
  $('#more').on('click', function(e) {
    e.preventDefault();
    increase();
  });
  $('#stop').on('click', function(e) {
    e.preventDefault();
    stop();
  });

  models.player.addEventListener('change', trackChanged);

  exports.start = start;
});
