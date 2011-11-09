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
          dispatchMouseEvents({ type:'click', altKey:true, target:toClick, button:0 });
        };
        if(main){
          a.addEventListener("click", main, false);
        }
        
        var dragging = function (e) {
          var original = ifr.contentDocument.getElementsByTagName("img")[0].getAttribute("src");
          var title = document.getElementsByClassName('viewdata')[0].getElementsByTagName('span')[0].textContent
          title.replace(':', '：');
          var creator = document.getElementsByClassName('prof')[0].getElementsByTagName('strong')[0].textContent;
          creator.replace(':', '：');
          var id = document.URL.substring(document.URL.lastIndexOf("/") + 1);
          var ext = original.substring(original.lastIndexOf("."));
        
          var filename = "application/octet-stream:" + creator + " - " + title + "(" + id + ")" + ext + ":" + original;
          e.dataTransfer.setData("DownloadURL", filename);
        };
        
        if(dragging){
          a.addEventListener("dragstart", dragging, false);
        }
      };
      document.getElementById("open_original_content").submit();


    } else {
      var main = function(){
        var images = document.getElementsByClassName("viewbody")[0].getElementsByTagName("img");
        var toClick = document.createElement("a");
        toClick.setAttribute("href", images[0].getAttribute("src"));
        dispatchMouseEvents({ type:'click', altKey:true, target:toClick, button:0 });
      };
      
      var dragging = function (e) {
        var images = document.getElementsByClassName("viewbody")[0].getElementsByTagName("img");
        var original = images[0].getAttribute("src");
        var title = document.getElementsByClassName('viewdata')[0].getElementsByTagName('span')[0].textContent
        title.replace(':', '：');
        var creator = document.getElementsByClassName('prof')[0].getElementsByTagName('strong')[0].textContent;
        creator.replace(':', '：');
        var id = document.URL.substring(document.URL.lastIndexOf("/") + 1);
        var ext = original.substring(original.lastIndexOf("."));
      
        var filename = "application/octet-stream:" + creator + " - " + title + "(" + id + ")" + ext + ":" + original;
        e.dataTransfer.setData("DownloadURL", filename);
      }

    }
  } else if(type == "/img/job/view/ma.gif") {
    var main = function(){
      var images = document.getElementsByClassName("viewbody")[0].getElementsByTagName("img");
      for(var i = 0; i < images.length; i++) {
        var toClick = document.createElement("a");
        toClick.setAttribute("href", images[i].getAttribute("original"));
        dispatchMouseEvents({ type:'click', altKey:true, target:toClick, button:0 });
      }
    };
  }

  var click = function(){
    if(main){
      a.addEventListener("click", main, false);
    }
  };
  click();
  
  var drag = function(){
    if(dragging){
      a.addEventListener("dragstart", dragging, false);
    }
  };
  drag();
  mv.appendChild(a);
})();
