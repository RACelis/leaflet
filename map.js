///// MAPAS DE FONDO
var osm = L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
{attribution: 'Map Data &copy; OpenstreetMap contributors'}); 

var map = L.map('map',{
	center:[23.000, -100.000],
	zoom:5,
    minZoom: 5,	
	layers:[osm]
});

var carto = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",{
		"attribution": "\u0026copy; \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eOpenStreetMap\u003c/a\u003e contributors \u0026copy; \u003ca href=\"http://cartodb.com/attributions\"\u003eCartoDB\u003c/a\u003e, CartoDB \u003ca href =\"http://cartodb.com/attributions\"\u003eattributions\u003c/a\u003e", 
		"detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false}
).addTo(map);

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    minZoom: 1,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo (map);


///// CORRDENADAS EXTREMAS
var suroeste = L.latLng(10, -130),
noreste = L.latLng(35, -75);
var bounds = L.latLngBounds(suroeste, noreste);

map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, {animate: false });
});


/// Nombre de mapas base
var baseMaps = {
	"<b>Calles</b>": osm,
	"<b>Satélite</b>": googleSat,
	"<b>CartoDB</b>": carto,
};

///// Grupos de capas

var entidades = L.layerGroup([]);
var municipios = L.layerGroup([]);
var rivers = L.layerGroup([]);
var volcanoes = L.layerGroup([]);
var tectonica = L.layerGroup([]);


/*var overlayMaps = {
	"<b>Entidades Federativas</b>": entidades,
	"<b>Municipios</b>": municipios,
	"<b>Ríos</b>": rivers,
	"<b>Volcanes</b>": volcanoes,
	"<b>Placas tectónicas</b>": tectonica
};*/

var overlaysTree = {
  label: "<b>ШАРИ POI</b>",
  selectAllCheckbox: true,
  children: [
    /* start POI from JSON */
    // набір "1700–1721"
    {
      label: "<b>1700–1721</b>",
      selectAllCheckbox: true,
      children: [
        { label: "Пам’ятні місця", layer: L.marker([-99.63, 19.55]) },
        { label: "Хроніка подій", layer: L.marker([-100.63, 20.55]) }
      ]
    },
    // набір "1917–1921"
    {
      label: "<b>1917–1921</b>",
      selectAllCheckbox: true,
      children: [
        { label: "ALICANTE - ALC", layer: L.marker([-98.63, 18.55]) },
        { label: "ALMERIA - LEI", layer: L.marker([-101.63, 21.65]) }
      ]
    },
     // набір "Різні"   
    {label: '<div class="leaflet-control-layers-separator"></div>'},
    {
      label: "<b>МЕЖІ</b>",
      selectAllCheckbox: false,
      children: [
        { label: "Полтавська фортеця", layer: L.marker([-99.33, 20.55]) },
        { label: "Мапа України Візіком (підписи)", layer: ([-100.33, 21.55]) },
        { label: "OpenStreetMap GPS traces", layer: ([-98.33, 22.55]) }
      ]
    }
  ]
};
/* ends POI */

var layersTree = L.Control.Layers.Tree(baseMaps, overlaysTree, {
  namedToggle: true,
  selectorBack: false,
  closedSymbol: "&#8862",
  openedSymbol: "&#8863",
  collapseAll: '-',
  expandAll: '+',
  collapsed: true
}).addTo(map).collapseTree().expandSelected().collapseTree(true);

        L.DomEvent.on(L.DomUtil.get('onlysel'), 'click', function() {
            layersTree.collapseTree(true).expandSelected(true);
        });

	

///L.control.layers(baseMaps, overlayMaps, overlaysTree).addTo (map);

///// Mapas de contexto

/// Países
function country_style(feature) {
    return {
        fillColor: 'gray90',
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.1
    };
}

L.geoJson(paises, {
	style: country_style
}).addTo(map);

/// Estados
function edo_style(feature) {
    return {
        fillColor: 'green',
        weight: 0.9,
        opacity: 0.8,
        color: 'darkgreen',
        dashArray: '1',
        fillOpacity: 0.1
    };
}

L.geoJson(estados, {
	style: edo_style
}).addTo(entidades);

/// Municipios
function mun_style(feature) {
    return {
        fillColor: 'red',
        weight: 0.5,
        opacity: 0.7,
        color: 'gray',
        dashArray: '1',
        fillOpacity: 0.1
    };
}

L.geoJson(ayuntamientos, {
	style: mun_style
}).addTo(municipios);

/// Ríos
function rio_style(feature){
	return {
		weight: 0.9,
		opacity: 0.9,
		color: 'darkblue',
		dashArray: '1'
	};
}

L.geoJson(rios, {
	style: rio_style
}).addTo(rivers);

/// Volcanes
var vulcan = L.icon({
   iconUrl:'img/volcano.svg',
   iconSize:[13,13],
   iconAnchor:[10,20],
   popupAnchor:[0,-24]
});

L.geoJson(vulcanos,{
	pointToLayer: function (feature, latlng) {
	return L.marker(latlng, {icon: vulcan})
	}
}).addTo(volcanoes);


//// Placas tectónicas
function placas_style(feature) {
    return {
        fillColor: 'white',
        weight: 1.5,
        opacity: 1,
        color: '#d95a0b',
        dashArray: '3',
        fillOpacity: 0
    };
}

L.geoJson(placas, {
	style: placas_style
}).addTo(tectonica);

