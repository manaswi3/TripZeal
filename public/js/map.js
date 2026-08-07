import * as maplibregl from "https://unpkg.com/maplibre-gl@6.2.0/dist/maplibre-gl.mjs";
async function getCoordinates() {
    const location = cc;

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
        {
            headers: {
                "User-Agent": "TripZeal"
            }
        }
    );

    const data = await response.json();
    return [data[0].lon,data[0].lat];
}

const coordinates = await getCoordinates();
console.log(coordinates);

const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/bright",
    center: coordinates,
    zoom: 14,
});

new maplibregl.Marker()
    .setLngLat(coordinates)
    .addTo(map);

map.addControl(new maplibregl.NavigationControl());