(function(){
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
  if((type == "/img/job/view/mo.gif") || (type == "/img/job/view/il.gif")) {
    if(document.getElementsByClassName("viewbody")[0].getElementsByTagName("img")[0].style.cursor == "pointer") {
      var main = function(){
        if(document.getElementById("open_original_content").getAttribute("target") == "TD_temp") {
          return;
        }
        //Load image in iframe
        var ifr = document.createElement("iframe");
        ifr.setAttribute("id", "TD_temp");
        document.body.appendChild(ifr);
        document.getElementById("open_original_content").setAttribute("target", "TD_temp");

        ifr.onload = function(){
          var toClick = document.createElement("a");
          toClick.setAttribute("href", ifr.contentDocument.getElementsByTagName("img")[0].getAttribute("src"));
          dispatchMouseEvents({ type:'click', altKey:true, target:toClick, button:0 });
          document.body.removeChild(ifr);
        };

        document.getElementById("open_original_content").submit();
      };
    } else {
      var main = function(){
        var images = document.getElementsByClassName("viewbody")[0].getElementsByTagName("img");
        var toClick = document.createElement("a");
        toClick.setAttribute("href", images[0].getAttribute("src"));
        dispatchMouseEvents({ type:'click', altKey:true, target:toClick, button:0 });
     };
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

  var mv = document.getElementById("mv");
  var a = document.createElement("a");
  var img = document.createElement("img")
  img.setAttribute("src", chrome.extension.getURL("download.png"));
  a.appendChild(img);
  a.setAttribute("href", "javascript:void(0);");
  var click = function(){
  	a.addEventListener("click", main, false);
  };
  click();
  mv.appendChild(a);
})();
