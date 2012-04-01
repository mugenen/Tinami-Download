(function() {
  'use strict';
  var addLink, dispatchMouseEvents, download, filename, form, getFileName, getImageCreator, getImageID, getImageTitle, ifr, main, type;

  if (!document.getElementById("view")) return;

  dispatchMouseEvents = function(opt) {
    /*
        Alt + Click
        See: http://d.hatena.ne.jp/Griever/20100904/1283603283
    */
    var evt;
    evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(opt.type, opt.canBubble || true, opt.cancelable || true, opt.view || window, opt.detail || 0, opt.screenX || 0, opt.screenY || 0, opt.clientX || 0, opt.clientY || 0, opt.ctrlKey || false, opt.altKey || false, opt.shiftKey || false, opt.metaKey || false, opt.button || 0, opt.relatedTarget || null);
    return opt.target.dispatchEvent(evt);
  };

  getImageTitle = function() {
    var tag;
    tag = $('.viewdata span');
    if (tag.length > 0) {
      return tag.text();
    } else {
      return null;
    }
  };

  getImageCreator = function() {
    var tag;
    tag = $('.prof strong');
    if (tag.length > 0) {
      return tag.text();
    } else {
      return null;
    }
  };

  getImageID = function() {
    return document.URL.substring(document.URL.lastIndexOf('/') + 1);
  };

  getFileName = function() {
    var creator, id, title;
    creator = getImageCreator();
    title = getImageTitle();
    id = getImageID();
    if ((creator != null) && (title != null) && (id != null)) {
      return "" + creator + " - " + title + "(" + id + ")";
    } else {
      return null;
    }
  };

  download = function(url, filename) {
    var toClick;
    toClick = $('<a>');
    toClick.attr('href', url);
    toClick.attr('download', filename);
    return dispatchMouseEvents({
      type: 'click',
      altKey: false,
      target: toClick.get(0),
      button: 0
    });
  };

  addLink = function(main) {
    var a, img, parent;
    img = $('<img>');
    img.attr('src', chrome.extension.getURL('download.png'));
    img.attr('draggable', false);
    a = $('<a>');
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    a.one('click', main);
    parent = $('#mv');
    return parent.append(a);
  };

  type = $('#view img').attr('src');

  filename = getFileName();

  if (!(filename != null)) return;

  if (type === '/img/job/view/mo.gif' || type === '/img/job/view/il.gif') {
    if ($('.viewbody img').css('cursor') === 'pointer') {
      ifr = $('<iframe>');
      ifr.attr('id', 'TD_temp');
      $('body').append(ifr);
      form = $('#open_original_content');
      form.attr('target', 'TD_temp');
      form.submit();
      form.removeAttr("target");
      ifr.load(function() {
        var main;
        main = function() {
          var original;
          original = ifr.contents().find('img').eq(0).attr('src');
          download(original, filename);
          return false;
        };
        return addLink(main);
      });
    } else {
      main = function() {
        var images;
        images = $('.viewbody:eq(0) img');
        download(images.attr('src'), filename);
        return false;
      };
      addLink(main);
    }
  } else if (type === '/img/job/view/ma.gif') {
    main = function() {
      var i, image, images, _len;
      images = $('.viewbody:eq(0) img');
      for (i = 0, _len = images.length; i < _len; i++) {
        image = images[i];
        download(image.getAttribute('src'), "" + filename + " - " + (i + 0));
      }
      return false;
    };
    addLink(main);
  }

}).call(this);
