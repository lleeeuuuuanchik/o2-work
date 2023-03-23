o2.slider =
{
	sliderArrows: document.querySelectorAll('.slider__slider-arrow'),
	sliderImgs: document.querySelectorAll('.slider__slider-img'),
	sliderPaggination: document.querySelectorAll('.slider__slider-paginate'),
	currentSlide: 0,


	init()
	{
	},

	next()
	{
		if(this.currentSlide >= this.sliderImgs.length - 1)
		{
			this.currentSlide = 0;
		}
		else
		{
			this.currentSlide++;
		}

		this.updateSlider();
	},

	prev()
	{
		if(this.currentSlide <= 0)
		{
			this.currentSlide = this.sliderImgs.length - 1;
		}
		else
		{
			this.currentSlide--;
		}

		this.updateSlider();
	},

	pagginationSlider(num)
	{
		this.currentSlide = num;
		this.updateSlider();
	},

	updateSlider()
	{
		this.sliderPaggination.forEach(el => {
			el.classList.remove('slider__slider-paginate--active')
		})

		if (this.sliderPaggination[this.currentSlide].classList.contains('slider__slider-paginate--active') == false)
		{
			this.sliderPaggination[this.currentSlide].classList.add('slider__slider-paginate--active')
		}

		this.sliderImgs.forEach( el => el.style.transform = `translateX( -${ this.currentSlide * 100 }% )` )
	},

}




