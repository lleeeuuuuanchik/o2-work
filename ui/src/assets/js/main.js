"use strict";
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
		this.innputMask.init();
		this.initSlider();
		this.gYamap.init();
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
};

o2.cookie =
{
	set(name, value, options = {})
	{
		if(!options.path)
			options.path = '/';

		if (options.expires instanceof Date)
			options.expires = options.expires.toUTCString();

		let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

		for (let optionKey in options)
		{
			updatedCookie += "; " + optionKey;
			let optionValue = options[optionKey];
			if (optionValue !== true)
			{
				updatedCookie += "=" + optionValue;
			}
		}

		document.cookie = updatedCookie;
	},
	get(name)
	{
		let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},
	delete(name)
	{
		this.set(name, "", {
			'max-age': -1
		});
	},
};
