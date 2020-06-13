
var map = L.map('mapid', {
    minZoom: 2,
	maxZoom: 17,
}).setView([0,0], 3);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
}).addTo(map);
var southWest = L.latLng(-89.98155760646617, -1000000),
northEast = L.latLng(89.99346179538875, 1000000);
var bounds = L.latLngBounds(southWest, northEast);
// Prevent scrolling out of bounds
map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});

// Add pollutants maps
L.control.layers({
	'Aerosol density': L.tileLayer('https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/77755e5de016173525d1a96e3b1879b4-35b3579dedd1c7743c7edd58a01d7286/tiles/{z}/{x}/{y}'),
	'Ozone density': L.tileLayer('https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/40c504cebed35050c46dc4d1685d5311-e307d28b666ab9c49a9762d07dcd750d/tiles/{z}/{x}/{y}').addTo(map),
	'Sulfur dioxide': L.tileLayer("https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/bac5cbcf642ae4af429f40d95ec1fa0d-7e73742935be515f4aacae8473eec320/tiles/{z}/{x}/{y}"),
	'Carbon monoxide': L.tileLayer("https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/a185c6f1a07eb0988598235e91f03400-3ed4ec80ca8e2504340362b2a6e88d3f/tiles/{z}/{x}/{y}"),
	'Formaldehyde': L.tileLayer("https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/391ce1667ea6631dd342cc790d5cab21-4797bf2625e2d9ec4e048359c165b5d8/tiles/{z}/{x}/{y}")
}, {
    // empty of checkboxes
    }).addTo(map);

// Add color legends
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
    for (var i = grades.length-1; i >= 0; i--) {
		let label = ""
		if (grades[i] == "black") label = "lowest concentration";
		else if (grades[i] == "red") label = "highest concentration";
        div.innerHTML +=
            '<i style="background:' + grades[i] + '"></i> '+label+'<br>';
    }
    return div;
};
legend.addTo(map);

// Handle layer change
titles = {
	79: "Aerosol Concentration",
	51: "Ozone Concentration",
	81: "Sulfur Dioxide Concentration",
	82: "Carbon Monoxide Concentration",
	83: "Formaldehyde Concentration"
}

map.on('baselayerchange', function (e) {
   currentLayerID = e.layer._leaflet_id;
   console.log(currentLayerID);
   $("#map-title").html(titles[currentLayerID]);
});