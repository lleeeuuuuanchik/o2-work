o2.gYamap = {
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
    }
}
