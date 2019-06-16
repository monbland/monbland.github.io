
$('a[href^="#"]').on('click',function (e) {
    e.preventDefault();
    var id = $(this).attr('href'),
        top = $(id).offset().top;

    $('body,html').animate({
        scrollTop: top
    }, 800);
});

function setFocus(){
    setTimeout( () => document.getElementById("inputName").focus(), 1000);
}

$(document).ready(function () {

    forRotate()
    $(window).resize( () => forRotate() );
    function forRotate() {
        if ($('body').innerWidth() < 768 )
            $('.rotate-md').removeClass('rotate')
        else if ( !$('.rotate-md')[0].classList.contains('rotate') )
            $('.rotate-md').addClass('rotate')
    }

    $('.rotate').mousemove(function (e) {
        // положение элемента
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        var elemLeft = $(this).offset().left;
        var elemTop = $(this).offset().top;
        var w = e.currentTarget.width;
        var h = e.currentTarget.height;
        var maxDeg =20;
        // положение курсора внутри элемента
        var Xinner = maxDeg * ((mouseX - elemLeft) / w * 2 - 1);
        var Yinner = maxDeg * ((mouseY - elemTop) / h * 2 - 1);

        $('.rotate').css('transition', '.1s');
        $('.rotate').css('transform', 'rotateX('+ Yinner +'deg) rotateY(' + -Xinner + 'deg)');
    });
    $('.rotate').mouseleave(function (e) {
        $('.rotate').css('transition', '1s');
        $('.rotate').css('transform', 'rotateX(0deg) rotateY(0deg)');
    });



    let delay = 0
    let lastElLi = 0
    let ol = $('ol')
    let li = $('.li')
    let num = $('.box-2-list-num')

    let imgHidden = true
    let img = $('.box-2-img img')

    magic()
    function magic(){
        let windowHeight = window.innerHeight
        let trigger = window.pageYOffset + windowHeight - windowHeight * 0.03;

// img
        if (imgHidden & trigger - windowHeight * 0.2 > img.offset().top & trigger < img.offset().top + img.height() + windowHeight) {
            img[0].classList.add("visible")
            img[0].style.transform = 'translateX(0px)'
        }

// li
        if (lastElLi !== li.length - 1 & trigger > ol.offset().top & trigger < ol.offset().top + ol.height() + windowHeight) {

            for (let i = 0; i < li.length; i++) {

                if (trigger > ol.offset().top + li[i].offsetTop & !li[i].classList.contains('visible')) {

                    li[i].classList.add("visible")
                    li[i].style.transitionDelay = delay + 's'
                    num[i].classList.add("visible")
                    num[i].style.transitionDelay = delay + 's'

                    delay += .3 //Задержка между появлением элементов
                    lastElLi = i

                } else if (i > 0) {
                    $('.li')[i - 1].addEventListener('transitionend', function () {
                        if (lastElLi === i - 1)
                            delay = 0
                    });
                }
            }
        }
    }

    $(window).on('scroll', function () {magic()} )

});
