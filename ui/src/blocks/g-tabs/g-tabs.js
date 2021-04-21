"use strict"
o2.gTabs =
{
	open(instance, tabId)
	{
		this.activateTab(instance);
		const $tabsContainer = $(instance).closest('._tabs-container');
		$tabsContainer.find("[data-tab]").removeClass('open');
		$tabsContainer.find(`[data-tab="${tabId}"]`).addClass('open');
	},
	activateTab(activeTab)
	{
		$(activeTab).siblings('._tab').removeClass('active');
		$(activeTab).addClass('active');
	}
};