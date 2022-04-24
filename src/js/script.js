$(document).ready(function() {
    $(".burger").click(function(event) {
        $(".burger").toggleClass("burger-active");
        $(".menu__nav").toggleClass("menu__nav-active");
    })
});

// Faq
let faq__item = function () {
    let data = $(".faqs__item").attr("data-faqs");

    $(".faq__link").on("click", function() {
        if (data === "close"){
            $(".faq__descr").slideUp();
            if ($(this).hasClass("active")){
            $(this).toggleClass("active");
        }
        else{
            $(".faq__link").removeClass("active");
            $(this).toggleClass("active")
        }
        }
        else {
            $(this).toggleClass("active");
        }
        $(this).next(".faq__descr").not(":animated").slideToggle();
    });
}
faq__item();

$(document).ready(function(){
	$('.menu a').click(function(e){
    	if($(this).attr('href').indexOf('#') != -1){ // Проверяем, является и ссылка действительно якорной ссылкой.
			e.preventDefault(); // Отменяем событие перехода.
            var href = $(this).attr('href').replace('#', ''); // Получаем из якорной ссылки нужный ID элемента, к которому будет происходить переход.
			
			if($('#'+href).length > 0){ // Проверяем, существует ли на странице нужный нам элемент.
            	var tophref = $('body').find('#'+href).offset().top; // Получаем координаты элемента, относительно начала страницы.
            	$('html, body').animate({scrollTop: tophref}, 800); // Создаём анимацию скрола к нужному элементу.
			}
		}
    });
});

// masketinput

$('input[name=phone]').mask("+996 (111) 11-11-11");

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