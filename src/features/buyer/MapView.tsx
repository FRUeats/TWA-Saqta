/**
 * MapView - Interactive Map with Store Locations
 * 
 * Shows all stores on OpenStreetMap using Leaflet
 */

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { storesApi, Store } from '../../api/stores';
import { useTelegram } from '../../hooks/useTelegram';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
    const navigate = useNavigate();
    const { hapticFeedback } = useTelegram();
    const [stores, setStores] = useState<Store[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStores();
        getUserLocation();
    }, []);

    const loadStores = async () => {
        try {
            const data = await storesApi.getAll();
            setStores(data);
        } catch (error) {
            console.error('Failed to load stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.log('Location access denied:', error);
                }
            );
        }
    };

    // Default center: Bishkek, Kyrgyzstan
    const defaultCenter: [number, number] = [42.8746, 74.5698];
    const center = userLocation || defaultCenter;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-tg-bg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button mb-4 mx-auto"></div>
                    <p className="text-tg-text">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-[1000] bg-tg-secondary/95 backdrop-blur-sm p-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="text-tg-button text-2xl"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-tg-text">Nearby Stores</h1>
                        <p className="text-xs text-tg-hint">{stores.length} stores found</p>
                    </div>
                </div>
            </div>

            {/* Map */}
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Store Markers */}
                {stores.map((store) => (
                    <Marker key={store.id} position={[store.latitude, store.longitude]}>
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-base mb-1">{store.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{store.address}</p>
                                {store.phone && (
                                    <p className="text-xs text-gray-500 mb-2">📞 {store.phone}</p>
                                )}
                                <button
                                    onClick={() => {
                                        hapticFeedback('light');
                                        navigate('/');
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium w-full transition-colors"
                                >
                                    🛍️ View Offers
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={userLocation}>
                        <Popup>
                            <div className="text-center p-2">
                                <p className="font-semibold">📍 You are here</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Info Card */}
            <div className="absolute bottom-6 left-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🗺️</span>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Find stores near you</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tap on markers to see details</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapView;
