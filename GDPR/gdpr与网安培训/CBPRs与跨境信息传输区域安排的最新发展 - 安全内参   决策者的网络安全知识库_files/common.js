/* 自适应高度 */
function setPageHeight(){
    var windowHeight = $(window).height();
    var headerHeight = $("header.header nav").outerHeight();
    var footerHeight = $("footer.footer").outerHeight();
    $("section.main-container").css("min-height", (windowHeight-headerHeight-footerHeight+1) + "px");
}
setPageHeight();
/*刷新图形验证码*/
$('.captchaCode-img').click(function () {
    this.src = '/cap?s='+ new Date().getTime();
});
/* 发送验证码 */
$('.mobilecode-btn').click(function(){
    var btn =$(this);
    btn.parent().children('.help-block').remove();
    var mobile=$("#mobile").val();
    var captcha=$("#captcha").val();
    if(mobile == ''){
        $("#mobile").focus();
        return;
    }
    if(captcha == ''){
        $("#captcha").focus();
        return;
    }
    btn.addClass('disabled');
    $.post('/sendmobilecode',{'_token':$('input[name=_token]').val(),'mobile':mobile,'captcha':captcha},function(re){
        if(re.code == '10000'){
            btn.text('已发送(59秒)');
            codeCountDown(btn);
            $('#code').focus();
        }else{
            btn.removeClass('disabled');
            $('.captchaCode-img').attr('src','/cap?s='+ new Date().getTime());
            btn.parent().append($('<span class="help-block"><strong>'+re.msg+'</strong></span>'));
        }
    });
});

function codeCountDown(obj, time){
    if(!time) time=60;
    time--;
    if(time<=0) {
        obj.text('获取验证码');
        obj.removeClass('disabled');
        return;
    }
    obj.text('已发送('+time+'秒)');
    setTimeout(function(){
        codeCountDown(obj, time);
    },1000);
}
/* /发送验证码 */

/* 加载文章 */
function loadArticles(attrs) {
    var lastPublishedAt, tag, keywords, author, parentObj, clickObj;
    if (attrs.lastPublishedAt) lastPublishedAt = attrs.lastPublishedAt;
    if (attrs.tag) tag = attrs.tag;
    if (attrs.keywords) keywords = attrs.keywords;
    if (attrs.author) author = attrs.author;
    if (attrs.parentObj) {
        parentObj = attrs.parentObj;
    } else {
        return false;
    }
    if (attrs.clickObj) {
        clickObj = attrs.clickObj;
    } else {
        return false;
    }
    $.get('/api/articles', {
        "lastPublishedAt": lastPublishedAt,
        "tag": tag,
        "keywords": keywords,
        "author": author,
        "referer" : 'web'
    }, function (re) {
        if (re.code == "10000") {
            $.each(re.data, function (k, article) {
                var row = $('<li class="list-item"></li>');
                var onlyText = false;
                if (article.thumb_image_url && article.thumb_image_url != '') {
                    row.append('<div class="thumb"><a target="_blank" href="/articles/' + article.id + '" title="' + article.title + '"><img class="lazyload" src="/transprent.png" data-original="' + article.thumb_image_url + '"></a></div>');
                } else {
                    onlyText = true;
                }
                var info = $('<div class="info' + (onlyText ? ' text-info' : '') + '"><h2 class="title"></h2><div class="meta"><div class="meta-left"><span class="author"></span><span class="time"></span></div></div><p class="intro hidden-xs"></p></div>');
                info.children('h2.title').html('<a target="_blank" href="/articles/' + article.id + '" title="' + article.title + '">' + article.title + '</a>');
                if (article.industryTag) info.find(".author").before('<span class="tag"><a href="/articles?tag=' + encodeURIComponent(article.industryTag.title) + '" target="_blank">' + article.industryTag.title + '</a></span>');
                if (article.author) info.find(".author").html('<a style="color: #999" href="/articles?author=' + encodeURIComponent(article.author) + '" target="_blank">' + article.author + '</a>');
                info.find(".time").html(article.humansPublishedAt);
                if (article.summary) {
                    var textLength = onlyText ? 72 : 45;
                    var summary = article.summary;
                    if (summary.length > textLength) summary = summary.substring(0, textLength) + "...";
                    info.find(".intro").html('<a href="/articles/' + article.id + '">' + summary + '</a>');
                }
                row.append(info);
                parentObj.append(row);

                $("img.lazyload").lazyload();

                if (k == re.data.length - 1) {
                    clickObj.attr("data-lastPublishedAt", article.published_at);
                }
            });

            if (re.data.length < 20) clickObj.parent().hide();
        }
    });
}
/* /加载文章 */
if ($(window).width() > 767) {
    // 返回顶端
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        scrollTop > 100 ? $(".gototop").fadeIn() : $(".gototop").fadeOut();
    });

    $(".gototop").click(function () {
        $("html,body").animate({scrollTop: 0}, 200);
    });
}