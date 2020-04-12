o2.gSelect =
{
	/**
	 * ссылка на обработчик клика вне блока
	 */
	outListeners: [],

	/**
	 * Открывает нужную выпадашку
	 * @$select - jQuery объект для селекта
	 */
	open($select)
	{
		this.close();
		$select.addClass('g-select--opened');
		let listner = o2.clickOutside($select, () => {
			this.close();
		});
		this.outListeners.push(listner);
	},

	/**
	 * Закрывает все выпадашки
	 */
	close()
	{
		$('._select').removeClass('g-select--opened');
		for(let listner of this.outListeners)
			document.removeEventListener('click', listner);
		this.outListeners = [];
	},

	/**
	 * открытие/закрытие списка
	 */
	toggle(instance)
	{
		let $select = $(instance).parents('._select')
		if (!$select.hasClass('g-select--opened'))
			this.open($select);
		else
			this.close();
	},

	/**
	 * устанавливаем название выбранного города
	 * которое просто выводится
	 */
	setName($select,name)
	{
		$select.find('._selected-text').html(name);
	},

	/**
	 * устанавливаем значение выбранного элемента которые передеаются в форму
	 */
	setSelectedValue($select,selectedValue)
	{
		$select.find('._selected-value').val(selectedValue);
	},

	/**
	 * выбор города в шапке
	 */
	selecttItem(instance)
	{
		let $select = $(instance).parents('._select');
		$select.removeClass('error');
		$select.find('._option').removeClass('g-select__item--active');
		$(instance).addClass('g-select__item--active');
		let name = $(instance).text(),
			selectedValue = $(instance).data('value');

		this.setName($select,name);
		this.setSelectedValue($select,selectedValue);
		this.close();
	}
};