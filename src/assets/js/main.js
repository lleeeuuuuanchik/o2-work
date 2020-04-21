"use strict"
/**
 * инициализация всех инициализаций
 */
$(document).ready(function()
{
	o2.init();

	o2.uiKit.init();
});

/**
 * основной объект
 */
const o2 =
{
	/**
	 * вызов функций, которые должны запускаться при загрузке страницы
	 */
	init()
	{
		this.gRangeSlider.init();
		this.gDatePicker.init();
		this.innputMask.init()
		this.initSlider()
	},
	/**
	* отслеживание клика вне блока
	*/
	clickOutside(element, callback)
	{
		const outsideChecker = (event) =>
		{
			const container = $(element);

			if (!container.is(event.target) && container.has(event.target).length === 0)
			{
				document.removeEventListener('click', outsideChecker);
				callback();
			}
		};

		document.addEventListener('click', outsideChecker);

		return outsideChecker;
	},
}