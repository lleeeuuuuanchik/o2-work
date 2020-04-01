"use strict"
o2.initSlider = function ()
{
	$('.g-slider').slick(
	{
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 1,
		prevArrow: '<img src="../src/assets/svg/Ellipse 1.svg" class="prev-arrow">',
		nextArrow: '<img src="../src/assets/svg/Ellipse 2.svg" class="next-arrow">'
	});
}