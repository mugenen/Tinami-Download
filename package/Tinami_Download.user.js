'use strict';
(function(){
  if(!document.getElementById("view")) {
      return;
  }
  var type = document.getElementById("view").getElementsByTagName("img")[0].getAttribute("src");
  //Alt + Click
  //See: http://d.hatena.ne.jp/Griever/20100904/1283603283
  function dispatchMouseEvents(opt) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(opt.type, opt.canBubble||true, opt.cancelable||true, opt.view||window, 
                       opt.detail||0, opt.screenX||0, opt.screenY||0, opt.clientX||0, opt.clientY||0, 
                       opt.ctrlKey||false, opt.altKey||false, opt.shiftKey||false, opt.metaKey||false, 
                       opt.button||0, opt.relatedTarget||null);
    opt.target.dispatchEvent(evt);
    return evt;
  }
  var mv = document.getElementById("mv");
  var a = document.createElement("a");
  var img = document.createElement("img")
  img.setAttribute("src", chrome.extension.getURL("download.png"));
  img.setAttribute("draggable", false)
  a.appendChild(img);
  a.setAttribute("href", "javascript:void(0);");

  var filename = function (e) {
    var title = document.getElementsByClassName('viewdata')[0].getElementsByTagName('span')[0].textContent
    var creator = document.getElementsByClassName('prof')[0].getElementsByTagName('strong')[0].textContent;
    var id = document.URL.substring(document.URL.lastIndexOf("/") + 1);
  
    var filename = creator + " - " + title + "(" + id + ")";
    return filename;
  }

  if((type == "/img/job/view/mo.gif") || (type == "/img/job/view/il.gif")) {
    if(document.getElementsByClassName("viewbody")[0].getElementsByTagName("img")[0].style.cursor == "pointer") {
      //Load image in iframe
      var ifr = document.createElement("iframe");
      ifr.setAttribute("id", "TD_temp");
      document.body.appendChild(ifr);
      document.getElementById("open_original_content").setAttribute("target", "TD_temp");

      ifr.onload = function(){
        var main = function(){
          var toClick = document.createElement("a");
          var original = ifr.contentDocument.getElementsByTagName("img")[0].getAttribute("src");
          toClick.setAttribute("href", original);
          toClick.setAttribute('download', filename());
          dispatchMouseEvents({ type:'click', altKey:false, target:toClick, button:0 });
        };
        if(main){
          a.addEventListener("click", main, false);
        }
      };
      
      document.getElementById("open_original_content").submit();
      document.getElementById("open_original_content").removeAttribute("target");
    } else {
      var main = function(){
        var images = document.getElementsByClassName("viewbody")[0].getElementsByTagName("img");
        var toClick = document.createElement("a");
        toClick.setAttribute("href", images[0].getAttribute("src"));
        toClick.setAttribute('download', filename());
        dispatchMouseEvents({ type:'click', altKey:false, target:toClick, button:0 });
      };
    }
  } else if(type == "/img/job/view/ma.gif") {
    var main = function(){
      var images = document.getElementsByClassName("viewbody")[0].getElementsByTagName("img");
      for(var i = 0; i < images.length; i++) {
        var toClick = document.createElement("a");
        toClick.setAttribute("href", images[i].getAttribute('src'));
        toClick.setAttribute('download', filename() + ' - ' + (i + 1));
        dispatchMouseEvents({ type:'click', altKey:false, target:toClick, button:0 });
      }
    };
  }

  var click = function(){
    if(main){
      a.addEventListener("click", main, false);
    }
  };
  click();
  
  mv.appendChild(a);
})();
