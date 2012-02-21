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
    tag = document.querySelector('.viewdata span');
    if (tag != null) {
      return tag.textContent;
    } else {
      return null;
    }
  };

  getImageCreator = function() {
    var tag;
    tag = document.querySelector('.prof strong');
    if (tag != null) {
      return tag.textContent;
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
      return creator + ' - ' + title + '(' + id + ')';
    } else {
      return null;
    }
  };

  download = function(url, filename) {
    var toClick;
    toClick = document.createElement('a');
    toClick.setAttribute('href', url);
    toClick.setAttribute('download', filename);
    return dispatchMouseEvents({
      type: 'click',
      altKey: false,
      target: toClick,
      button: 0
    });
  };

  addLink = function(main) {
    var a, img, parent;
    a = document.createElement('a');
    a.addEventListener('click', main, false);
    img = document.createElement('img');
    img.setAttribute('src', chrome.extension.getURL('download.png'));
    img.setAttribute('draggable', false);
    a.appendChild(img);
    a.setAttribute('href', 'javascript:void(0);');
    parent = document.getElementById('mv');
    return parent.appendChild(a);
  };

  type = document.querySelector('#view img').getAttribute("src");

  filename = getFileName();

  if (!(filename != null)) return;

  if (type === '/img/job/view/mo.gif' || type === '/img/job/view/il.gif') {
    if (document.querySelector('.viewbody img').style.cursor === 'pointer') {
      ifr = document.createElement('iframe');
      ifr.setAttribute('id', 'TD_temp');
      document.body.appendChild(ifr);
      ifr.onload = function() {
        var main;
        main = function() {
          var original;
          original = ifr.contentDocument.getElementsByTagName("img")[0].getAttribute("src");
          download(original, filename);
          return this.removeEventListener('click', main);
        };
        return addLink(main);
      };
      form = document.getElementById('open_original_content');
      form.setAttribute('target', 'TD_temp');
      form.submit();
      form.removeAttribute("target");
    } else {
      main = function() {
        var images;
        images = document.querySelector('.viewbody').querySelectorAll('img');
        download(images[0].getAttribute("src"), filename);
        return this.removeEventListener('click', main);
      };
      addLink(main);
    }
  } else if (type === '/img/job/view/ma.gif') {
    main = function() {
      var i, image, images, _len;
      images = document.querySelector('.viewbody').querySelectorAll('img');
      for (i = 0, _len = images.length; i < _len; i++) {
        image = images[i];
        download(image.getAttribute('src'), filename + ' - ' + (i + 1));
      }
      return this.removeEventListener('click', main);
    };
    addLink(main);
  }

}).call(this);
