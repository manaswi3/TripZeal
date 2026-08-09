// utils/geocode.js
module.exports = async function geocode(location, country) {
    const query = `${location}, ${country}`;

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        {
            headers: {
                "User-Agent": "TripZeal"
            }
        }
    );

    const data = await response.json();

    if (!data.length) {
        throw new Error("Location not found");
    }

    return [
        Number(data[0].lon),
        Number(data[0].lat)
    ];
};