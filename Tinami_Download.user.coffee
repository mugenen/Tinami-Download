'use strict';
if(!document.getElementById("view"))
    return;

dispatchMouseEvents = (opt) ->
    ###
    Alt + Click
    See: http://d.hatena.ne.jp/Griever/20100904/1283603283
    ###
    evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(opt.type, opt.canBubble||true, opt.cancelable||true, opt.view||window, 
                       opt.detail||0, opt.screenX||0, opt.screenY||0, opt.clientX||0, opt.clientY||0, 
                       opt.ctrlKey||false, opt.altKey||false, opt.shiftKey||false, opt.metaKey||false, 
                       opt.button||0, opt.relatedTarget||null);
    opt.target.dispatchEvent(evt);

getImageTitle = () ->
    tag = document.querySelector('.viewdata span')
    if tag?
        tag.textContent;
    else
        null

getImageCreator = () ->
    tag = document.querySelector('.prof strong')
    if tag?
        tag.textContent;
    else
        null

getImageID = () ->
    document.URL.substring(document.URL.lastIndexOf('/') + 1)

getFileName = () ->
    creator = getImageCreator()
    title = getImageTitle()
    id = getImageID()
    if creator? and title? and id?
        creator + ' - ' + title + '(' + id + ')'
    else
        null

download = (url, filename) ->
    toClick = document.createElement('a');
    toClick.setAttribute('href', url);
    toClick.setAttribute('download', filename);
    dispatchMouseEvents({type:'click', altKey:false, target:toClick, button:0});

addLink = (main) ->
    a = document.createElement('a');
    a.addEventListener('click', main, false);

    img = document.createElement('img')
    img.setAttribute('src', chrome.extension.getURL('download.png'));
    img.setAttribute('draggable', false)
    a.appendChild(img);
    a.setAttribute('href', 'javascript:void(0);');

    parent = document.getElementById('mv');
    parent.appendChild(a);


type = document.querySelector('#view img').getAttribute("src")
filename = getFileName()

if not filename?
    return

if type == '/img/job/view/mo.gif' or type == '/img/job/view/il.gif'
    if document.querySelector('.viewbody img').style.cursor == 'pointer'#拡大可能な一枚絵
        ifr = document.createElement('iframe');
        ifr.setAttribute('id', 'TD_temp');
        document.body.appendChild(ifr);

        ifr.onload = () ->
            main = () ->
                original = ifr.contentDocument.getElementsByTagName("img")[0].getAttribute("src");
                download(original, filename)
                @removeEventListener('click', main);
            addLink(main)
        
        form = document.getElementById('open_original_content')
        form.setAttribute('target', 'TD_temp');
        form.submit();
        form.removeAttribute("target");
    else#拡大できない一枚絵
        main = () ->
            images = document.querySelector('.viewbody').querySelectorAll('img')
            download(images[0].getAttribute("src"), filename)
            this.removeEventListener('click', main);
        addLink(main)
else if type == '/img/job/view/ma.gif'#漫画の場合
    main = () ->
        images = document.querySelector('.viewbody').querySelectorAll('img')
        for image, i in images
            download(image.getAttribute('src'), filename + ' - ' + (i + 1))
        this.removeEventListener('click', main);
    addLink(main)


