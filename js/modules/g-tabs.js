"use strict"
const O2_TABS = {
	open(instance, tabId)
	{
		const tabsContainer = $(instance).parents('._tabs-container');
		const openedTab = $(tabsContainer).find('.g-tab[data-tab-id="' + tabId + '"]');

		if ($(openedTab).hasClass('g-tab_open'))
			return false;

		$(tabsContainer).find('.g-tab.g-tab_open').fadeOut(200, () =>
		{
			$('.g-tab').removeClass('g-tab_open')
			$(openedTab).fadeIn(200).addClass('g-tab_open');
		});
		this.markActiveTab(instance)
	},
	markActiveTab(activeItem)
	{
		$('.g-tabs__item').each((index, item) =>
		{
			if ($(item).hasClass('g-tabs__item_active'))
				$(item).removeClass('g-tabs__item_active');

			$(activeItem).addClass('g-tabs__item_active');
		})
	}
};