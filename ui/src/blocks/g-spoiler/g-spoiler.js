o2.gSpoiler =
{
	spoilerToggle(title, method=null)
	{
		switch (method)
		{
			case 'one':
				this.oneShowSpoiler(title);
				break;
			case 'onlyOne':
				this.onlyOneSpoiler(title);
				break;
			default:
				this.defaultSpoiler(title);
		}
	},
	defaultSpoiler(title)
	{
		$(title)
			.toggleClass('g-spoiler__title--active')
			.siblings('._g-spoiler__list')
			.slideToggle(300)
	},
	oneShowSpoiler(title)
	{
		const $title = $(title)
		const $gSpoiler = $title.parents('._g-spoiler')

		const isActive = $title.hasClass('g-spoiler__title--active')

		$gSpoiler.find('._g-spoiler__list').slideUp(300)
		$gSpoiler.find('._g-spoiler__title').removeClass('g-spoiler__title--active')

		if (!isActive)
		{
			$title.siblings('._g-spoiler__list').slideDown(300)
			$title.addClass('g-spoiler__title--active')
		}
	},
	onlyOneSpoiler(title)
	{
		const $title = $(title)
		const $gSpoiler = $title.parents('._g-spoiler')

		const isActive = $title.hasClass('g-spoiler__title--active')

		$gSpoiler.find('._g-spoiler__list').slideUp(300)
		$gSpoiler.find('._g-spoiler__title').removeClass('g-spoiler__title--active')

		$title.siblings('._g-spoiler__list').slideDown(300)
		$title.addClass('g-spoiler__title--active')
	}
}