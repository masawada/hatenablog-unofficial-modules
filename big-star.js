(function() {
  var bindEvents, filter, override, replaceButton, replaceCommentButton, replaceStar, throttle, user_icon;
  user_icon = function(name) {
    return "http://www.hatena.ne.jp/users/" + (encodeURI(name.slice(0, 2))) + "/" + (encodeURI(name)) + "/profile.gif";
  };
  throttle = function(fn, delay) {
    var timer;
    timer = null;
    return function() {
      var args, context;
      if (timer) {
        return;
      }
      context = this;
      args = arguments;
      return timer = setTimeout(function() {
        timer = null;
        return fn.apply(context, args);
      }, delay || 50);
    };
  };
  replaceStar = function($star) {
    var $container, $star_image, $star_src, $user_image;
    if ($star.prop('data-hatena-big-star-init')) {
      return;
    }
    $star.prop('data-hatena-big-star-init', true);
    $container = $('<span>');
    $container.addClass('hatena-big-star-star-container');
    $user_image = $star.find('img');
    $star_src = $user_image.attr('src');
    $user_image.addClass('hatena-big-star-user');
    $user_image.attr({
      src: user_icon($star[0].href.match(/hatena\.ne\.jp\/([^\/]+)\/?/)[1])
    });
    $star_image = $('<img>');
    $star_image.addClass('hatena-big-star-star');
    $star_image.attr({
      src: $star_src
    });
    $container.append($user_image).append($star_image);
    return $star.append($container);
  };
  replaceButton = function($container) {
    if ($container.prop('data-hatena-big-star-init')) {
      return;
    }
    return $container.prop('data-hatena-big-star-init', true);
  };
  replaceCommentButton = function($button) {
    if ($button.prop('data-hatena-big-star-comment-init')) {
      return;
    }
    return $button.prop('data-hatena-big-star-comment-init', true);
  };
  filter = throttle(function() {
    $('span.hatena-star-star-container a').each(function() {
      try {
        return replaceStar($(this));
      } catch (error) {
        if (console) {
          return console.log(error);
        }
      }
    });
    $('.hatena-star-star-container').each(function() {
      return replaceButton($(this));
    });
    return $('.hatena-star-comment-button').each(function() {
      return replaceCommentButton($(this));
    });
  });
  filter();
  override = function() {
    var k, style, v;
    style = {
      '-webkit-transform': 'scale(2.0)',
      '-webkit-transform-origin': '0% 0%',
      '-moz-transform': 'scale(2.0)',
      '-moz-transform-origin': '0% 0%',
      '-o-transform': 'scale(2.0)',
      '-o-transform-origin': '0% 0%',
      'background': 'white'
    };
    for (k in style) {
      v = style[k];
      Hatena.Star.Pallet.PALLET_STYLE += "" + k + ": " + v + "; ";
    }
    return Hatena.Star.AddButton.prototype.showColorPallet = function(e) {
      var pos;
      this.clearSelectedColorTimer();
      if (!this.pallet) {
        this.pallet = new Hatena.Star.Pallet();
      }
      pos = Ten.Geometry.getElementPosition(this.img);
      if (Ten.Browser.isFirefox || Ten.Browser.isOpera) {
        pos.y += 40;
        pos.x += 6;
      } else {
        pos.x += 2;
        pos.y += 36;
      }
      return this.pallet.showPallet(pos, this);
    };
  };
  bindEvents = function() {
    $(document.body).bind('DOMNodeInserted', function() {
      return filter();
    });
    return $(document.body).bind('mouseup', function() {
      return filter();
    });
  };
  bindEvents();
  return override();
})();