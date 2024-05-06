const apLat = 51.230285;
const apLon = 4.414211;

var map = L.map('map').setView([apLat, apLon], 16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var helmetIcon = L.icon({
    iconUrl: '../assets/icons/helmet_map_icon.png',
    iconSize: [50,50],
    iconAnchor: [25,30]});

var marker = L.marker([apLat, apLon], {icon: helmetIcon}).addTo(map);

    marker.on('click', function(e){
        map.flyTo([apLat, apLon], 16);
    });