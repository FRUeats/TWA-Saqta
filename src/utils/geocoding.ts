/**
 * Geocoding utility using Nominatim (OpenStreetMap)
 * Free service for converting addresses to coordinates
 */

export interface GeocodingResult {
    lat: number;
    lng: number;
    displayName: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
    try {
        // Nominatim API - free geocoding service from OpenStreetMap
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'SaqtaApp/1.0', // Required by Nominatim
            },
        });

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name,
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};
