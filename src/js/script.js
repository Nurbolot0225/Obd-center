$(document).ready(function(){
	$('.header a').click(function(e){
    	if($(this).attr('href').indexOf('#') != -1){ 
			e.preventDefault(); 
            var href = $(this).attr('href').replace('#', ''); 
			
			if($('#'+href).length > 0){ 
            	var tophref = $('body').find('#'+href).offset().top; 
            	$('html, body').animate({scrollTop: tophref}, 800); 
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
}

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

$(document).ready(function(){
  $("a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();

      var hash = this.hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){

        window.location.hash = hash;
      });
    } 
  });
});