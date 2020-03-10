const O2_SELECT = {
	selectState:
	{
		/**
		* открыт ли список
		*/
		isOpen: false,
		
		/**
		* ссылка на обработчик клика вне блока
		*/
		clickOutsideListener: null,
		
		/**
		* открытие/закрытие списка
		*/
		selectDropdownToggle()
		{
			if (!this.isOpen)
			{
				this.clickOutsideListener = o2.clickOutside($('.g-select'), () =>
				{
					o2.gSelect.selectState.selectDropdownToggle()
				});

				$('.g-select').addClass('g-select_opened');
				this.isOpen = true;
			}
			else
			{
				$('.g-select').removeClass('g-select_opened');
				document.removeEventListener('click', this.clickOutsideListener);
				this.isOpen = false;
			}
		},

		/**
		* устанавливаем название выбранного города
		*/
		setSelectedItemName(instance)
		{
			$('.g-select').find('._selected-item-name').html($(instance).html());
		},

		/**
		* выбор города в шапке
		*/
		markSelectedItem(instance)
		{
			$('.g-select-list__item').each((index, element) =>
			{
				if ($(element).hasClass('g-select-list__item_active'))
					$(element).removeClass('g-select-list__item_active');
			})
			$(instance).addClass('g-select-list__item_active');

			this.setSelectedItemName(instance);
			o2.gSelect.selectState.selectDropdownToggle()
		}
	},
};