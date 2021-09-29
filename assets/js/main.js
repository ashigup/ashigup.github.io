
(function ($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.browser == 'edge' || skel.vars.mobile) ? function () {
		return $(this)
	} : function (intensity) {

		var $window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function () {

			var $t = $(this),
				on, off;

			on = function () {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function () {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function () {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			skel.on('change', function () {

				if (skel.breakpoint('medium').active)
					(off)();
				else
					(on)();

			});

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function () {
				$window.trigger('scroll');
			});

		return $(this);

	};

	$(function () {

		var $window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$banner = $('#banner');

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load pageshow', function () {
			window.setTimeout(function () {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Clear transitioning state on unload/hide.
		$window.on('unload pagehide', function () {
			window.setTimeout(function () {
				$('.is-transitioning').removeClass('is-transitioning');
			}, 250);
		});

		// Fix: Enable IE-only tweaks.
		if (skel.vars.browser == 'ie' || skel.vars.browser == 'edge')
			$body.addClass('is-ie');

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		// Prioritize "important" elements on medium.
		skel.on('+medium -medium', function () {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Scrolly.
		$('.scrolly').scrolly({
			offset: function () {
				return $header.height() - 2;
			}
		});

		// Tiles.
		var $tiles = $('.tiles > article');

		$tiles.each(function () {

			var $this = $(this),
				$image = $this.find('.image'),
				$img = $image.find('img'),
				$link = $this.find('.link'),
				x;

			// Image.

			// Set image.
			$this.css('background-image', 'url(' + $img.attr('src') + ')');

			// Set position.
			if (x = $img.data('position'))
				$image.css('background-position', x);

			// Hide original.
			$image.hide();

			// Link.
			if ($link.length > 0) {

				$x = $link.clone()
					.text('')
					.addClass('primary')
					.appendTo($this);

				$link = $link.add($x);

				$link.on('click', function (event) {

					var href = $link.attr('href');

					// Prevent default.
					event.stopPropagation();
					event.preventDefault();

					// Start transitioning.
					// $this.addClass('is-transitioning');
					// $wrapper.addClass('is-transitioning');



					// Redirect.
					window.setTimeout(function () {

						if ($link.attr('target') == '_blank')
							window.open(href);
						else
							location.href = href;

					}, 500);

				});

			}

		});

		// Header.
		if (skel.vars.IEVersion < 9)
			$header.removeClass('alt');

		if ($banner.length > 0 &&
			$header.hasClass('alt')) {

			$window.on('resize', function () {
				$window.trigger('scroll');
			});

			$window.on('load', function () {

				$banner.scrollex({
					bottom: $header.height() + 10,
					terminate: function () {
						$header.removeClass('alt');
					},
					enter: function () {
						$header.addClass('alt');
					},
					leave: function () {
						$header.removeClass('alt');
						$header.addClass('reveal');
					}
				});

				window.setTimeout(function () {
					$window.triggerHandler('scroll');
				}, 100);

			});

		}

		// Banner.
		$banner.each(function () {

			var $this = $(this),
				$image = $this.find('.image'),
				$img = $image.find('img');

			// Parallax.
			$this._parallax(0.275);

			// Image.
			if ($image.length > 0) {

				// Set image.
				$this.css('background-image', 'url(' + $img.attr('src') + ')');

				// Hide original.
				$image.hide();

			}

		});

		// Menu.
		var $menu = $('#menu'),
			$menuInner;

		$menu.wrapInner('<div class="inner"></div>');
		$menuInner = $menu.children('.inner');
		$menu._locked = false;

		$menu._lock = function () {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function () {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function () {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function () {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function () {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menuInner
			.on('click', function (event) {
				event.stopPropagation();
			})
			.on('click', 'a', function (event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
				$menu._hide();

				// Redirect.
				window.setTimeout(function () {
					window.location.href = href;
				}, 250);

			});

		$menu
			.appendTo($body)
			.on('click', function (event) {

				event.stopPropagation();
				event.preventDefault();

				$body.removeClass('is-menu-visible');

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function (event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
				$menu._toggle();

			})
			.on('click', function (event) {

				// Hide.
				$menu._hide();

			})
			.on('keydown', function (event) {

				// Hide on escape.
				if (event.keyCode == 27)
					$menu._hide();

			});

	});

	// Gallery image hover
	$(".img-wrapper").hover(
		function () {
			$(this).find(".img-overlay").animate({ opacity: 1 }, 600);
		}, function () {
			$(this).find(".img-overlay").animate({ opacity: 0 }, 600);
		}
	);

	// Lightbox
	var $overlay = $('<div id="overlay"></div>');
	var $image = $("<img>");
	var $prevButton = $('<div id="prevButton"><i class="fa fa-chevron-left"></i></div>');
	var $nextButton = $('<div id="nextButton"><i class="fa fa-chevron-right"></i></div>');
	var $exitButton = $('<div id="exitButton"><i class="fa fa-times"></i></div>');
	var $launchButton = $('<a id="launchButton" class="button icon fa-download">Visit Website</a>');

	// Add overlay
	$overlay.append($image).prepend($prevButton).append($nextButton).append($exitButton).append($launchButton);
	$("#gallery").append($overlay);

	// Hide overlay on default
	$overlay.hide();

	// When an image is clicked
	$(".img-overlay").click(function (event) {
		// Prevents default behavior
		event.preventDefault();
		// Adds href attribute to variable
		var imageLocation = $(this).prev().attr("href");
		// Add the image src to $image
		$image.attr("src", imageLocation);
		// Fade in the overlay
		$overlay.fadeIn("slow");
		console.log(this);
		$url = this.getAttribute("href");
		console.log($url);
	});

	// When the overlay is clicked
	$overlay.click(function () {
		// Fade out the overlay
		$(this).fadeOut("slow");
	});

	// When next button is clicked
	$nextButton.click(function (event) {
		// Hide the current image
		$("#overlay img").hide();
		// Overlay image location
		var $currentImgSrc = $("#overlay img").attr("src");
		// Image with matching location of the overlay image
		var $currentImg = $('#image-gallery img[src="' + $currentImgSrc + '"]');
		// Finds the next image
		var $nextImg = $($currentImg.closest(".image").next().find("img"));
		// All of the images in the gallery
		var $images = $("#image-gallery img");
		// If there is a next image
		if ($nextImg.length > 0) {
			// Fade in the next image
			$("#overlay img").attr("src", $nextImg.attr("src")).fadeIn(800);
		} else {
			// Otherwise fade in the first image
			$("#overlay img").attr("src", $($images[0]).attr("src")).fadeIn(800);
		}
		// Prevents overlay from being hidden
		event.stopPropagation();
	});

	// When previous button is clicked
	$prevButton.click(function (event) {
		// Hide the current image
		$("#overlay img").hide();
		// Overlay image location
		var $currentImgSrc = $("#overlay img").attr("src");
		// Image with matching location of the overlay image
		var $currentImg = $('#image-gallery img[src="' + $currentImgSrc + '"]');
		// Finds the next image
		var $nextImg = $($currentImg.closest(".image").prev().find("img"));
		// Fade in the next image
		$("#overlay img").attr("src", $nextImg.attr("src")).fadeIn(800);
		// Prevents overlay from being hidden
		event.stopPropagation();
	});

	// When the exit button is clicked
	$exitButton.click(function () {
		// Fade out the overlay
		$("#overlay").fadeOut("slow");
	});

	//when the launch butto is clicked
	$launchButton.click(function () {
		//var $currentUrl = $("a.projectUrl").attr("href");
		window.open($url, '_blank');
	});

	$(window).load(function () {
		$(".loader").delay(1000).fadeOut("slow");
	});

})(jQuery);

var pathEls = document.querySelectorAll('path');
for (var i = 0; i < pathEls.length; i++) {
	var pathEl = pathEls[i];
	var offset = anime.setDashoffset(pathEl);
	pathEl.setAttribute('stroke-dashoffset', offset);
	anime({
		targets: pathEl,
		strokeDashoffset: [offset, 0],
		duration: anime.random(1000, 3000),
		delay: anime.random(0, 2000),
		loop: true,
		direction: 'alternate',
		easing: 'easeInOutSine',
		autoplay: true
	});

	document.onkeydown = function (e) {
		if (event.keyCode == 123) {
			return false;
		}
		if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
			return false;
		}
		if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
			return false;
		}
		if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
			return false;
		}
		if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
			return false;
		}
	}

}