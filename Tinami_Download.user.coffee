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
    tag = $('.viewdata span')
    if tag.length > 0
        tag.text();
    else
        null

getImageCreator = () ->
    tag = $('.prof strong')
    if tag.length > 0
        tag.text();
    else
        null

getImageID = () ->
    document.URL.substring(document.URL.lastIndexOf('/') + 1)

getFileName = () ->
    creator = getImageCreator()
    title = getImageTitle()
    id = getImageID()
    if creator? and title? and id?
        "#{creator} - #{title}(#{id})"
    else
        null

download = (url, filename) ->
    toClick = $('<a>')
    toClick.attr('href', url);
    toClick.attr('download', filename);
    dispatchMouseEvents({type:'click', altKey:false, target:toClick.get(0), button:0});

addLink = (main) ->
    img = $('<img>')
    img.attr('src', chrome.extension.getURL('download.png'));
    img.attr('draggable', false)
    
    a = $('<a>')
    a.append(img);
    a.attr('href', 'javascript:void(0);');
    a.one('click', main);

    parent = $('#mv');
    parent.append(a);


type = $('#view img').attr('src')
filename = getFileName()

if not filename?
    return

if type == '/img/job/view/mo.gif' or type == '/img/job/view/il.gif'
    if $('.viewbody img').css('cursor') == 'pointer'#拡大可能な一枚絵
        ifr = $('<iframe>');
        ifr.attr('id', 'TD_temp');
        $('body').append(ifr);

        form = $('#open_original_content')
        form.attr('target', 'TD_temp');
        form.submit();
        form.removeAttr("target");

        ifr.load () ->
            main = () ->
                original = ifr.contents().find('img').eq(0).attr('src');
                download(original, filename)
                false
            addLink(main)
    else#拡大できない一枚絵
        main = () ->
            images = $('.viewbody:eq(0) img')
            download(images.attr('src'), filename)
            false
        addLink(main)
else if type == '/img/job/view/ma.gif'#漫画の場合
    main = () ->
        images = $('.viewbody:eq(0) img')
        for image, i in images
            download(image.getAttribute('src'), "#{filename} - #{i + 0}")
        false
    addLink(main)


