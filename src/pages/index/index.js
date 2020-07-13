o2.index =
{
	submit(instance)
	{
		let validator = new O2Validator(instance);
		validator.callbacks.custom = this.customValidation;
		validator.callbacks.number = this.myPhone;

		if(!validator.validate())
		{
			validator.errors = ['Скорректируйте данные и повторите попытку']
			validator.showGlobalErrors();
			return false;
		}
		return false;
	},
	customValidation(field)
	{
		// return true если все ок
		let $input = $(field).find('input');
		let $textarea = $(field).find('textarea');
		if($input.val() == ''||$textarea.val()=='')
		{
			$(field).addClass('send__all-error')
			return false;
		}else
		{
			$(field).removeClass('send__all-error')
		}
		return true;
	},
	myPhone(field)
	{
		let $input = $(field).find('input');
		const regex = /^((\+7|7|8)+\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2})$/;
		if(regex.test($input.val()))
		{
			return true;
			$(field).removeClass('send__all-error');
		}
		else
		{
			$(field).addClass('send__all-error')
			return false;
		}
	},
}