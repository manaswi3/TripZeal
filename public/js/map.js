import * as maplibregl from "https://unpkg.com/maplibre-gl@6.2.0/dist/maplibre-gl.mjs";
console.log(cc);

const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/bright",
    center: cc,
    zoom: 14,
});

new maplibregl.Marker()
    .setLngLat(cc)
    .addTo(map);

map.addControl(new maplibregl.NavigationControl());