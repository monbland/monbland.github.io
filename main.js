(function () {
    var $pic = $(".pic");
    $pic.on('mousemove', function(e) {
        var w, h, offsetPic, offsetX, offsetY, transformPic;
        var elem = document.getElementsByClassName('pic');
        var picPosition = elem[0].getBoundingClientRect();
        w = picPosition.right - picPosition.left;
        h = picPosition.bottom - picPosition.top;
        offsetX = 0.5 - (e.screenX - picPosition.left) / w;
        offsetY = 0.5 - (e.screenY - picPosition.top) / h;
        offsetPic = $pic.data('offset');
        transformPic = 'translateY(' + -offsetX * offsetPic + 'px) rotateX(' + -offsetY * offsetPic + 'deg) rotateY(' + offsetX * (offsetPic * 2) + 'deg)';
        $pic.css('transform', transformPic);
    });
    $pic.on('mouseout', function(e) {
        var transformPic = 'translateY(0px) rotateX(0deg) rotateY(0deg)';
        $pic.css('transform', transformPic);
    });
}).call(this);
$('a[href^="#"]').on('click',function (e) {
    e.preventDefault();
    var id = $(this).attr('href'),
        top = $(id).offset().top;


    $('body,html').animate({
        scrollTop: top
    }, 800);

    
});