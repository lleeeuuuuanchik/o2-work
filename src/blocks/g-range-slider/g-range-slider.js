o2.gRangeSlider =
{
	init()
	{
		$('._range-trigger').each((index, element) => {
			const dataParams = $(element).data();
			const minName = $(element).attr('data-field-min-name');
			const maxName = $(element).attr('data-field-max-name');
			const type = $(element).attr('data-type');

			const slider = noUiSlider.create(element, {
				start: [dataParams.from, dataParams.to],
				connect: true,
				tooltips: true,
				step: 1,
				range:
				{
					'min': dataParams.min,
					'max': dataParams.max
				}
			});
			if (type == 'single')
				$(element).find('.noUi-origin').first().attr('disabled', true);
			const moneyFormat = (number) => {
				return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			};
			// настраиваем лэйблы для слайдера
			const sliderLabels = $(element).siblings('.g-range-slider-labels');
			if (sliderLabels.length) {
				const labelFrom = sliderLabels.find('.g-range-slider-labels_from');
				const labelTo = sliderLabels.find('.g-range-slider-labels_to');
				slider.on('update', function (values) {
					labelFrom.html(moneyFormat(Number(values[0])));
					labelTo.html(moneyFormat(Number(values[1])));
				});
			};
			slider.on('set', function (values, handle) {
				if (handle == 0)
					$(this.target).siblings('input[name="' + minName + '"]').trigger('change')
				else
					$(this.target).siblings('input[name="' + maxName + '"]').trigger('change')
			});
			slider.on('update', function (values) {
				$(this.target).siblings('input[name="' + minName + '"]').val(values[0]);
				$(this.target).siblings('input[name="' + maxName + '"]').val(values[1]);
			});
		})
	}
};