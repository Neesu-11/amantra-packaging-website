$(window).on("load", function () {

	$(window).scroll(function () {
		var sticky = $('.main-header'),
		scroll = $(window).scrollTop();
		if (scroll >= 100) sticky.addClass('fixed-header');
		else sticky.removeClass('fixed-header');
	});

});

/************** tabs-menu **************/
$('#portfolioParentTab').easyResponsiveTabs({
	type: 'default',
	width: 'auto',
	fit: true,
	tabidentify: 'portfolioParent',

	activate: function (event) {
		var $tab = $(this);
		var $info = $('#nested-tabInfo');
		var $name = $('span', $info);
		$name.text($tab.text());
		$info.show();
		newHash = '' + newHash;
		setTimeout(function () {
			$('.resp-tab-content-active.portfolioParent .our-portfolio-tab').each(function () {
				var $carousel = $(this);
				if ($carousel.data('owl.carousel')) {
					$carousel.trigger('refresh.owl.carousel');
				}
			});
		}, 150);
	}
});

//portfolio-slider
$('.full-banner').owlCarousel({
	items: 1,
	loop: true,	
	nav: false,
	dots: true,
	responsiveClass: true,
});
//portfolio-slider
$('.our-portfolio-tab').owlCarousel({
	loop: true,
	nav: true,
	dots: false,
	navText: ['‹','›'],
	responsiveClass: true,
	responsive: {
		0: {
			items: 1,
			margin: 20,
		},
		768: {
			items: 2,
		},
		992: {
			items: 3,
		},
		1200: {
			items: 3,
		},
		1400: {
			items: 3,
		}
	}
});
//portfolio-slider
$('.satisfied-slider').owlCarousel({
	loop: true,
	margin: 20,
	nav: false,
	dots: false,
	responsiveClass: true,
	responsive: {
		0: {
			items: 1,
		},
		768: {
			items: 1,
		},
		1280: {
			items: 2.2,
		},
		1300: {
			items: 2.2,
		}
	}
});

var owl = $(".satisfied-slider");
owl.owlCarousel();
$(".next-btn").click(function () {
	owl.trigger("next.owl.carousel");
});
$(".prev-btn").click(function () {
	owl.trigger("prev.owl.carousel");
});
$(".prev-btn").addClass("disabled");
$(owl).on("translated.owl.carousel", function (event) {
	if ($(".owl-prev").hasClass("disabled")) {
		$(".prev-btn").addClass("disabled");
	} else {
		$(".prev-btn").removeClass("disabled");
	}
	if ($(".owl-next").hasClass("disabled")) {
		$(".next-btn").addClass("disabled");
	} else {
		$(".next-btn").removeClass("disabled");
	}
});

//portfolio-slider
$('.awards-slider').owlCarousel({
	loop: false,
	margin: 20,
	nav: true,
	dots: false,
	responsiveClass: true,
	responsive: {
		0: {
			items: 1,
			margin: 10,
		},
		1024: {
			items: 2,
		},
		1280: {
			items: 3,
		},
		1400: {
			items: 4,
		}
	}
});
//packaging-services-slider-slider
$('.packaging-services-slider').owlCarousel({
	loop: false,
	margin: 30,
	nav: true,
	dots: false,
	responsiveClass: true,
	responsive: {
		0: {
			items: 1,
			margin: 10,
		},
		768: {
			items: 2,
			margin: 10,
		},
		1024: {
			items: 3,
		},
		1280: {
			items: 4,
		} 
	}
});
//value-addition-service-slider
$('.value-service-slider').owlCarousel({
	loop: false,
	margin: 20,
	nav: true,
	dots: false,
	responsiveClass: true,
	responsive: {
		0: {
			items: 1,
			margin: 10,
		},
		768: {
			items: 2,
			margin: 10,
		},
		1024: {
			items: 3,
		},
		1400: {
			items: 3,
		}
	}
});

$('.product-slider').owlCarousel({
	loop: false,
	margin: 20,
	nav: true,
	dots: false,
	responsiveClass: true,
	responsive: {
		0: {
			items: 1,
			margin: 10,
		},
		1024: {
			items: 2,
		},
		1280: {
			items: 3,
		},
		1400: {
			items: 3,
		}
	}
});

$('.choose-slider').owlCarousel({
	loop: false,
	margin: 20,
	nav: true,
	dots: false,
	responsiveClass: true,
	responsive: {
		0: {
			items: 1,
			margin: 10,
		},
		1024: {
			items: 2,
		},
		1280: {
			items: 4,
		},
		1400: {
			items: 4,
		}
	}
});

//partners-slider
$('.partners-slider').owlCarousel({
	loop: false,
	margin: 30,
	nav: true,
	dots: false,
	responsiveClass: true,
	responsive: {
		0: {
			items: 2,
			margin: 10,
		},
		1024: {
			items: 3,
		},
		1280: {
			items: 4,
		},
		1400: {
			items: 5,
		}
	}
});

//clients-slider
$('.clients-slider').owlCarousel({
	loop: false,
	margin: 20,
	nav: true,
	dots: false,
	responsiveClass: true,
	responsive: {
		0: {
			items: 2,
			margin: 10,
		},
		1024: {
			items: 3,
		},
		1280: {
			items: 4,
		},
		1400: {
			items: 5,
		}
	}
});

$('.equipment-items').owlCarousel({
	loop: false,
	margin: 30,
	nav: true,
	dots: false,
	responsiveClass: true,
	responsive: {
		0: {
			items: 1,
		},
		1024: {
			items: 2,
		},
		1280: {
			items: 3,
		},
		1400: {
			items: 4,
		}
	}
});

(() => {
    const counter = document.querySelectorAll('.counter');
    // covert to array
    const array = Array.from(counter);
    // select array element
    array.map((item) => {
        // data layer
        let counterInnerText = item.textContent;

        let count = 1;
        let speed = item.dataset.speed / counterInnerText
        function counterUp() {
            item.textContent = count++
            if (counterInnerText < count) {
                clearInterval(stop);
            }
        }
        const stop = setInterval(() => {
            counterUp();
        }, speed);
    })
})()


// Back to top
var btn = $('#button');
$(window).scroll(function () {
	if ($(window).scrollTop() > 300) {
		btn.addClass('show');
	} else {
		btn.removeClass('show');
	}
});
btn.on('click', function (e) {
	e.preventDefault();
	$('html, body').animate({ scrollTop: 0 }, '300');
});

// RESPONSIVE MENU
$(document).ready(function() {
	$('.main-navigation ul li:not(:only-child) ul').parent().addClass('has-child');
	//Menu ICon Append prepend for responsive
	$(window).on('resize', function(){
		if ($(window).width() < 1200) {
			if(!$('#menu_trigger').length){
				$('.header-widget').append('<button type="button" id="menu_trigger" class="nav-togl" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>');
			} else {
				$('#menu_trigger').appendTo('.header-widget');
			}
			if(!$('.navtrigger').length){
				$('.has-child > a').append('<span class="navtrigger"></span>')
			}
			if(!$('.submenu > .backmenu-row').length){
				$('.submenu').each(function(){
					var subvalue = $(this).prev('a').text();
					$(this).prepend('<div class="backmenu-row"><a href="#" class="back-trigger"></a><em>'+subvalue+'</em></div>');
				});
			}
		} else {
			$("#menu_trigger").remove();
			$('.navtrigger').remove();
			$('.back-trigger').remove();
			$('.back-trigger').remove();
		}
	}).resize(); 
	// Mobile menu on click open
	$(document).on('click',"#menu_trigger", function(){
		var isOpen = $('.main-navigation').toggleClass('open').hasClass('open');
		$(this).toggleClass('active', isOpen).attr('aria-expanded', isOpen ? 'true' : 'false').attr('aria-label', isOpen ? 'Close menu' : 'Open menu');
		if($('.has-child').hasClass("sub-open")){
			$('.has-child ').removeClass('sub-open');
		}
		$('.header-widget.bottom').slideUp();
		return false;
	});  
	// While open sub-menu add class
	$(document).on('click', '.navtrigger', function(){
		$(this).parents('li').addClass('sub-open');
		return false;
	});
	// Back to menu in mobile
	$(document).on('click', '.back-trigger', function(){
		$(this).closest('li.has-child').removeClass('sub-open');
		return false;
	});	

	$('.accordian > .accordian-card:first').addClass('active')
});	

// MOBILE CAROUSEL
var $serviceCarousel = $(".service-carousel");
$(window).resize(function() {
  showserviceCarousel();
});

function showserviceCarousel() {
  if ($serviceCarousel.data("owlCarousel") !== "undefined") {
    if (window.matchMedia('(max-width: 767px)').matches) {
      initialserviceCarousel();
    } else {
      destroyserviceCarousel();
    }
  }
}
showserviceCarousel();
function initialserviceCarousel() {
  $serviceCarousel.addClass("owl-carousel").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 2000,
    smartSpeed: 1000,
		margin: 12,
    nav:false,
    dots:false,
  });
}
function destroyserviceCarousel() {
  $serviceCarousel.trigger("destroy.owl.carousel").removeClass("owl-carousel");
}

// -----------
var $sustainabilityCarousel = $(".sustainability-carousel");
$(window).resize(function() {
  showsustainabilityCarousel();
});

function showsustainabilityCarousel() {
  if ($sustainabilityCarousel.data("owlCarousel") !== "undefined") {
    /* Mobile: stacked cards (natural height). Desktop: static 3-column row. */
    destroysustainabilityCarousel();
  }
}
showsustainabilityCarousel();
function initialsustainabilityCarousel() {
  $sustainabilityCarousel.addClass("owl-carousel").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 2000,
    smartSpeed: 1000,
		margin: 12,
    nav:false,
    dots:false,
  });
}
function destroysustainabilityCarousel() {
  $sustainabilityCarousel.trigger("destroy.owl.carousel").removeClass("owl-carousel");
}

// ------------
var $keyFactorCarousel = $(".keyfactor-carousel");
$(window).resize(function() {
  showkeyFactorCarousel();
});

function showkeyFactorCarousel() {
  if ($keyFactorCarousel.data("owlCarousel") !== "undefined") {
    if (window.matchMedia('(max-width: 767px)').matches) {
      initialkeyFactorCarousel();
    } else {
      destroykeyFactorCarousel();
    }
  }
}
showkeyFactorCarousel();
function initialkeyFactorCarousel() {
  $keyFactorCarousel.addClass("owl-carousel").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 2000,
    smartSpeed: 1000,
		margin: 12,
    nav:false,
    dots:false,
  });
}
function destroykeyFactorCarousel() {
  $keyFactorCarousel.trigger("destroy.owl.carousel").removeClass("owl-carousel");
}


// ACCORDIAN FUNCTION
var accordion = (function(){
  
	var $accordion = $('.accordian');
	var $accordion_header = $accordion.find('.accordian-header');
	var mh = $('.main-header').innerHeight();
   
	// default settings 
	var settings = {
	  // animation speed
	  speed: 400,
	  
	  // close all other accordion items if true
	  oneOpen: false
	};
	  
	return {
	  // pass configurable object literal
	  init: function($settings) {
		$accordion_header.on('click', function() {
		  accordion.toggle($(this));
		  $(this).toggleClass('active')
		  
		  setTimeout(() => {
			$('body, html').animate({
			  scrollTop: $(this).offset().top - mh - 20
			 }, 500)
		  }, 400)
		});
		
		$.extend(settings, $settings); 
		
		// ensure only one accordion is active if oneOpen is true
		if(settings.oneOpen && $('.accordian-card.active').length > 1) {
		  $('.accordian-card.active:not(:first)').removeClass('active');
		}
		
		// reveal the active accordion bodies
		$('.accordian-card.active').find('> .accordian-content').show();
	  },
	  toggle: function($this) {
			  
		if(settings.oneOpen && $this[0] != $this.closest('.accordian').find('> .accordian-card.active > .accordian-header')[0]) {
		  $this.closest('.accordian')
				 .find('.accordian-card') 
				 .removeClass('active')
				 .find('.accordian-content')
				 .slideUp()
		}
		
		// show/hide the clicked accordion item
		$this.closest('.accordian-card').toggleClass('active');
		$this.next().stop().slideToggle(settings.speed);
	  }	  
	}
})();
  
$(document).ready(function(){
	accordion.init({ speed: 300, oneOpen: true });
});

$(document).ready(function() {
	function equalHeight() {
			var maxHeight = 0;
			$('.our-satisfied-es').each(function(){
					var thisHeight = $(this).outerHeight();
					if(thisHeight > maxHeight){
							maxHeight = thisHeight;
					}
			});
			$('.our-satisfied-es').css('min-height', maxHeight);
	}

	// Run the function after the Owl Carousel is initialized
	$('.owl-carousel').on('initialized.owl.carousel resized.owl.carousel', function(event) {
			equalHeight();
	});

	// Run the function on window resize
	$(window).resize(function(){
			equalHeight();
	});

	// Initial function call
	equalHeight();
});
