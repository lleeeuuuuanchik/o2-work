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