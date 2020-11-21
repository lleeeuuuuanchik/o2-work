"use strict"
o2.initSlider = function ()
{
	$('.g-slider').slick(
	{
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 1,
		prevArrow: '<div class="prev-arrow"></div>',
		nextArrow: '<div class="next-arrow"></div>'
	});
}