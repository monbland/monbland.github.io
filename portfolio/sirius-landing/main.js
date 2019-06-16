console.log(document.getElementById("picture"));
var $pic = $(".pic")
$pic.on("mousemove", function(e) {
    var w, h, offsetPic, offsetX, offsetY, transformPic;
    var picPosition = document.getElementById("picture").getBoundingClientRect();
    w = e.currentTarget.width;
    h = e.currentTarget.height;
    offsetX = 0.5 - (e.pageX - $pic.offset().left) / w;
    offsetY = 0.5 - (e.pageY - $pic.offset().top) / h;
    offsetPic = $pic.data('offset');
    transformPic = 'rotateX(' + -offsetY * offsetPic + 'deg) rotateY(' + offsetX * (offsetPic * 2) + 'deg)';
    $pic.css('transform', transformPic);
    console.log(e.screenY + " " + e.currentTarget.width+ "  " + h);
});
$pic.on('mouseout', function(e) {
    var transformPic = 'translateY(0px) rotateX(0deg) rotateY(0deg)';
    $pic.css('transform', transformPic);
});
$('a[href^="#"]').on('click',function (e) {
    e.preventDefault();
    var id = $(this).attr('href'),
        top = $(id).offset().top;


    $('body,html').animate({
        scrollTop: top
    }, 800);

    
});