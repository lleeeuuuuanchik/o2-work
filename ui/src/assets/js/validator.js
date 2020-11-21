class O2Validator
{
	constructor(formInstance)
	{
		this.formInstance = formInstance;
		this.initCallbacks();
	}

	validate()
	{
		this.errors = [];
		let $formFields = $(this.formInstance).find('._field'),
			hasErrors   = false,
			self        = this;
		$formFields.each(function(fieldIndex,field)
		{
			$(field).removeClass('error');
			let callbacks = $(field).data('call');
			if(typeof callbacks == 'undefined')
				return true;

			callbacks = callbacks.replace(/ +/g,' ').trim().split(' ');
			for(let callback of callbacks)
			{
				if(!self.callbacks[callback].call(self,field))
				{
					hasErrors = true;
					$(field).addClass('error');
					return true;
				}
			}

		});
		this.showGlobalErrors();
		return !hasErrors;
	}

	initCallbacks()
	{
		this.callbacks =
		{
			/**
			 * @return bool
			 */
			phone(field)
			{
				let $input = $(field).find('input');
				const regex = /^((\+7|7|8)+\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2})$/;
				if(regex.test($input.val()))
					return true;
				this.setMessage(field,'Телефон введен не корректно');
				return false;
			},

			empty(field)
			{
				let $input = $(field).find('input');
				let $textarea = $(field).find('textarea');
				if($input.val() == '' || $textarea.val() =='')
				{
					this.setMessage(field,'Заполните поле');
					return false;
				}
				return true;
			},
			selected(field)
			{
				let $input = $(field).find('input');
				if($input.val() == '')
				{
					this.setMessage(field,'Заполните поле');
					return false;
				}
				return true;
			},
			checked(field)
			{
				let $input = $(field).find('input');
				let checker = false;
				$input.each(function()
				{
					if($(this).prop('checked'))
						checker = true
				})
				if(checker)
					return true
				this.setMessage(field,'Ничего не выбрано');
		 		return false
			},
		};
	}

	setMessage(field,msg)
	{
		$(field).find('._error-msg').html(msg)
	}

	showGlobalErrors()
	{
		let errorsHtml = this.errors.join('</li><li>')
		let $errorsBlock = $(this.formInstance).find('._global-errors');
		$errorsBlock.html(`<ul><li>${errorsHtml}</li></ul>`);

		if(!this.errors.length)
			$errorsBlock.removeClass('show');
		else
			$errorsBlock.addClass('show');
	}

	setErrors(errors)
	{
		for(fieldCode in errors)
		{
			let $field = $(this.formInstance).find(`._field[data-code="${fieldCode}"]`);
			$field.addClass('error');
			this.setMessage($field[0],errors[fieldCode]);
		}
	}
}