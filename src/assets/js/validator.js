class O2Validator
{
	constructor(formInstance)
	{
		this.formInstance = formInstance;
	}

	validate()
	{
		this.errors = [];
		let $formFields = $(this.formInstance).find('._field'),
			hasErrors   = false;

		$formFields.each((i, field) =>
		{
			const $field = $(field);

			$field.removeClass('error');

			const callbacks = O2Validator.parseCalls($field);
			if(!callbacks) return true;

			for (let callback of callbacks)
			{
				if(!O2Validator.callbacks[callback]($field))
				{
					hasErrors = true;
					$field.addClass('error');
				}
			}

		});
		this.showGlobalErrors();
		return !hasErrors;
	}

	static fieldValidate(inputInstance)
	{
		let $field = $(inputInstance).parent('._field');
		$field.removeClass('error');

		let callbacks = O2Validator.parseCalls($field)
		if(!callbacks) return true;

		for (let callback of callbacks)
		{
			if (!O2Validator.callbacks[callback]($field))
			{
				$field.addClass('error');
				return false;
			}
		}
		return true

	}

	static parseCalls($field)
	{
		const callbacks = $field.data('call');

		return callbacks && callbacks.replace(/ +/g,' ').trim().split(' ')
	}


	static callbacks =
	{
		/**
		 * @return bool
		 */
		phone($field)
		{
			let $input = $field.find('input');
			const regex = /^((\+7|7|8)+\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2})$/;
			if(regex.test($input.val()))
				return true;
			O2Validator.setMessage($field,'Телефон введен не корректно');
			return false;
		},

		empty($field)
		{
			let $input = $field.find('input');
			let $textarea = $field.find('textarea');
			if($input.val() == '' || $textarea.val() =='')
			{
				O2Validator.setMessage($field,'Заполните поле');
				return false;
			}
			return true;
		},
		selected($field)
		{
			let $input = $field.find('input');
			if($input.val() == '')
			{
				O2Validator.setMessage($field,'Заполните поле');
				return false;
			}
			return true;
		},
		checked($field)
		{
			let $input = $field.find('input');
			let checker = false;
			$input.each(function()
			{
				if($(this).prop('checked'))
					checker = true
			})
			if(checker)
				return true
			O2Validator.setMessage($field,'Ничего не выбрано');
			return false
		},
		email($field)
		{
			let $input = $field.find('input');
			const regex = /\S+@\S+\.\S+/;
			if(regex.test($input.val())) return true

			O2Validator.setMessage($field,'Адрес почты введен не корректно');
			return false;
		}
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
			O2Validator.setMessage($field[0],errors[fieldCode]);
		}
	}

	static setMessage($field, msg)
	{
		$field.find('._error-msg').html(msg)
	}
}
