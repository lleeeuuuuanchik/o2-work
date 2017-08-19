"use strict"

/**
 * инициализация всех инициализаций
 */
$(document).ready(function()
{
	o2.init();
});

/**
 * основной объект
 * @type {object}
 */
var o2 = 
{
	/**
	 * вызов функций, которые должны запускаться при загрузке страницы
	 */
	init: function()
	{

	},
	popups:
	{
		showPopup: function(popup)
		{
			$('._overlay').addClass('_show');
			$('._standartPopup').addClass('_show');
		},
		closePopup: function(popup)
		{
			$('._overlay').removeClass('_show');
			$('.popup').removeClass('_show');
		},
	},
}