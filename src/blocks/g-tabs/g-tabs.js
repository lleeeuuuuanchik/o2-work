"use strict"
o2.gTabs = {
	open(instance, tabId)
	{
		const tabsContainer = $(instance).parents('._tabs-container');
		const openedTab = $(tabsContainer).find('.g-tab[data-tab-id="' + tabId + '"]');
		const tab = $(tabsContainer).find('.g-tab');

		if ($(openedTab).hasClass('g-tab_open'))
			return false;

		$(tabsContainer).find('.g-tab.g-tab_open').fadeOut(200, () =>
		{
			$(tab).removeClass('g-tab_open')
			$(openedTab).fadeIn(200).addClass('g-tab_open');
		});
		this.markActiveTab(instance)
	},
	markActiveTab(activeItem)
	{
		const tabItems = $(activeItem).parents('._tabs-container').find('.g-tabs__item');
		$(tabItems).each((index, item) =>
		{
			if ($(item).hasClass('g-tabs__item_active'))
				$(item).removeClass('g-tabs__item_active');

			$(activeItem).addClass('g-tabs__item_active');
		})
	}
};