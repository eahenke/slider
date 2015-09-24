(function() {
	"use strict";

	var timerId;

	$(document).ready(function() {
		assignSlideClasses();
		activateControls();		
		beginSlider();
	});

	function beginSlider() {
			timerId = setTimeout(function() {
			nextSlide(true);
			}, 5000);		
	}	

	//if passed true, slides forwards, if false, slides backwards
	function nextSlide(forward) {
		clearTimeout(timerId); //reset Slider timer;

		deactivateControls();

		var leftOrRight;
		var slidesToMove;
		var slideWidth = $('.slide').width();

		if(forward) {
			leftOrRight = "-=";
			slidesToMove = '.slide.active, .slide.right';
		} else {
			leftOrRight = "+=";
			slidesToMove = '.slide.active, .slide.left';
		}

		$(slidesToMove).animate({
				left: leftOrRight + slideWidth,
			}, 1000
			).promise().done(function(){
				queueSlides(forward);
				assignSlideClasses();
				activateControls();
				beginSlider();
			});					
	}

	function assignSlideClasses() {
		var current = $('.slide.active');
		var prev;
		var next;

		//assign next slide
		if(!current.next().length) {
			next = current.siblings().first();
		} else {
			next = current.next();
		}
		
		//assign prev slide
		if(!current.prev().length) {
			prev = current.siblings().last();
		} else {
			prev = current.prev();
		}

		prev.addClass('left');
		next.addClass('right');		
		dotMatch(current);
	}

	//After movement, based on direction, determines new active slide and removes old classes 
	function queueSlides(forward) {
		
		//must come before assigning the new active slide or both slides are stripped.
		$('.slide.active').removeClass('active');

		if(forward) {
			$('.slide.right').removeClass('right').addClass('active');
		} else {
			$('.slide.left').removeClass('left').addClass('active');
		}

		//strip left and right classes from all slides, leave only active
		$('.slide').removeClass('right left').removeAttr('style');
	}

	//Matches up the dot with the current slide.
	function dotMatch(currentSlide) {
		var index = currentSlide.index();
		$('.dot').removeClass('active');
		$('.dot').eq(index).addClass('active');	

	}

	//Based on which dot is clicked, sets up the corresponding slide (based on index) to be the next slide.
	function goToSlide() {
		var dotIndex = $(this).index();
		var currentIndex = $('.dot.active').index();

		//disables current dot from being selected.
		if(dotIndex != currentIndex) {		

			$('.slide').removeClass('left right');

			var forward;
			var directionClass;

			if(dotIndex > currentIndex) {
				directionClass = 'right';
				forward = true;
			} else {
				directionClass = 'left';
				forward = false;
			}
			
			$('.slide').eq(dotIndex).addClass(directionClass);			
			nextSlide(forward);
		}
	}

	//Turns on Slider controls.  Should be turned on initially, and after animation has completed.
	function activateControls() {
		$('.arrow').mousedown(function() {
			$(this).find('span').addClass('clicked');
		});

		$('.arrow').mouseup(function() {
			$(this).find('span').removeClass('clicked');
		});

		$('.arrow-right').click(function(){
			nextSlide(true);
		});
		$('.arrow-left').click(function() {
			nextSlide(false);
		});

		$('.dot').click(goToSlide);	
	}

	//Turns off Slider controls.  Should be called during animation to prevent click spamming.
	function deactivateControls() {
		$('.dot').off();
		$('.arrow').off();
			
	}	
		
})();