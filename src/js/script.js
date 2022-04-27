$(document).ready(function(){
	$('.header a').click(function(e){
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

window.onscroll = function() {myFunction()};

var navbar = document.getElementById("header");
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("header__sticky")
  } else {
    navbar.classList.remove("header__sticky");
  }
};

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