o2.gYamap =
{
	init()
	{
		ymaps.ready(this.initYamap)
	},
	initYamap()
	{
		let myMap = new ymaps.Map('yamap', {
			center: [43.02, 44.68], // Дзауджикау
			zoom: 12
		})

		myMap.geoObjects.add(new ymaps.Placemark([43.029347, 44.677649], {
			balloonContent: 'Супер команда разработчиков <strong>O2</strong>'
		}, {
			preset: 'islands#icon',
			iconColor: '#FF00FF'
		}))
	}
}
