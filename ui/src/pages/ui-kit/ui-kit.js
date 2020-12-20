o2.authForm =
{
	submit(instance)
	{
		let validator = new O2Validator(instance);
		validator.callbacks.custom = this.customValidation;

		if(!validator.validate())
			return false;

		// отправили запрос и якобы получили ошибку
		setTimeout(function()
		{
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
};

o2.uiKit =
{
	componentsFilter:'',
	components:
	[
		{name:'Select',class:'._select-component'},
		{name:'Range slider',class:'._range-slider-component'},
		{name:'Input',class:'._input-component'},
		{name:'Input width icon',class:'._input-width-icon-component'},
		{name:'Input masked',class:'._input-masked-component'},
		{name:'Checkbox',class:'._checkbox-component'},
		{name:'Radio',class:'._radio-component'},
		{name:'Tabs',class:'._tabs-component'},
		{name:'Date picker',class:'._date-picker-component'},
		{name:'Adaptive',class:'._adaptive-component'},
		{name:'Slider',class:'._slider-component'},
		{name:'Button',class:'._button-component'},
		{name:'Валидация форм',class:'._validation-component'},
		{name:'Popup',class:'._popup-component'},
		{name:'Pagination',class:'._pagination-component'},
		{name:'Notifications',class:'._notifications-component'},
		{name:'Input file',class:'._input-file_component'},
	],
	init()
	{
		PR.prettyPrint();
		this.renderComponentsList();
	},
	getComponents()
	{
		return this.components.filter(component=>
		{
			return component.name.toLowerCase().indexOf(this.componentsFilter) !== -1;
		});
	},
	renderComponentsList()
	{
		let componentsList = document.querySelector('._components-list');
		let comopsHtml = '';
		for(let component of this.getComponents())
		{
			comopsHtml += `<li onclick="o2.uiKit.selectComponent(this,'${component.class}')">${component.name}</li>`;
		}
		componentsList.innerHTML = comopsHtml;
	},
	selectComponent(instance, className)
	{
		if(instance.classList.contains('active'))
		{
			instance.classList.remove('active');

			for(let component of this.components)
				document.querySelector(component.class).style.display = 'block';
			return;
		}
		for (let nodeElement of document.querySelectorAll('.ui-kit__components-list .active'))
			nodeElement.classList.remove('active');

		instance.classList.add('active');
		for(let component of this.components)
			document.querySelector(component.class).style.display = 'none';

		document.querySelector(className).style.display = 'block';
	},

	filterComponents(instance)
	{
		this.componentsFilter = instance.value;
		this.renderComponentsList();
	}
};
