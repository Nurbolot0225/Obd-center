$(document).ready(function() {
    $(".burger").click(function(event) {
        $(".burger").toggleClass("burger-active");
        $(".menu__nav").toggleClass("menu__nav-active");
    })
});

// Fags
let faqs__item = function () {
    let data = $(".faqs__item").attr("data-faqs");

    $(".faqs__open").on("click", function() {
        if (data === "close"){
            $(".faqs__completed").slideUp();
            if ($(this).hasClass("active")){
            $(this).toggleClass("active");
        }
        else{
            $(".faqs__open").removeClass("active");
            $(this).toggleClass("active")
        }
        }
        else {
            $(this).toggleClass("active");
        }
        $(this).next(".faqs__completed").not(":animated").slideToggle();
    });
}
faqs__item();

// masketinput

$('input[name=phone]').mask("0 (999) 999-99-99");

// Smooth scroll and pageup 

$(window).scroll(function() {
    if ($(this).scrollTop() > 1600) {
        $('.pageup').fadeIn();
    } else {
        $('.pageup').fadeOut();
    }
});

$(document).ready(function(){
    $("a[href*=#up]").on("click", function(e){
      var anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top
      }, 777);
      e.preventDefault();
      return false;
    });
});