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
    if(scrollDuration === null) {
      scrollDuration = models.player.track.duration;
    }
    if(models.player.playing) {
      scroll();
    }
  }

  function stop() {
    viewport.stop();
    isScrolling = false;
    $('#toggle-scroll').text('Start');
  }

  function toggleScroll() {
    if(isScrolling) {
      stop();
    } else {
      scroll();
    }
  }

  function increase() {
    stop();
    scrollDuration = scrollDuration * 0.9;
    scroll();
  }

  function decrease() {
    stop();
    scrollDuration = scrollDuration * 1.1;
    scroll();
  }

  function trackChanged() {
    if(models.player.playing && !isScrolling) {
      start();
    } else if(!models.player.playing) {
      stop();
    }
  }

  viewport.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
    if (isScrolling && ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel" )){
      stop();  //.unbind('scroll mousedown DOMMouseScroll mousewheel keyup'); // This identifies the scroll as a user action, stops the animation, then unbinds the event straight after (optional)
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
    console.log("Toggle");
    e.preventDefault();
    toggleScroll();
  });

  models.player.addEventListener('change', trackChanged);

  exports.start = start;
});
