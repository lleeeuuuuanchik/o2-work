o2.gDatePicker =
{
	init()
	{
		$('input[name="birthday"]').daterangepicker({
			singleDatePicker: true,
			minYear: 1901,
			maxYear: parseInt(moment().format('YYYY'), 10),
			locale: {
				format: 'DD/MM/YYYY',
				"daysOfWeek": [
					"Sun",
					"Mon",
					"Tue",
					"Wed",
					"Thu",
					"Fri",
					"Sat"
				]
			}
		});
	},
};