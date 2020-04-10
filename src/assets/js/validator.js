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
				if($input.val() == '1')
					return true;
				this.setMessage(field,'Телевон введен не корректно');
				return false;
			},

			empty(field)
			{
				let $input = $(field).find('input');
				if($input.val() == '')
				{
					this.setMessage(field,'Заполните поле');
					return false;
				}
				return true;
			},

			selected(){},
			checked(){},
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



// -----------
o2.authForm =
{
	submit(instance)
	{
		let validator = new O2Validator(instance);
		validator.callbacks.custom = this.customValidation;

		if(!validator.validate())
			return false;

		// отправили запрос и якобы получили ошибку
		setTimeout(function(){
			validator.setErrors({
				phone:'Сообщение ошибки',
				email:'Сообщение ошибки'
			});
			validator.errors = [1,2,3];
			validator.showGlobalErrors();

		},500);
		return false;
	},
	customValidation(field)
	{
		// return true если все ок
		this.setMessage(field,'Что-то не так');
		return false;
	}
}