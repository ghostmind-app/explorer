import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap, Marker, Popup, LngLatBounds } from 'mapbox-gl';

// Import Shadcn UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; // Import Button for sign out
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Import the custom CSS
import './style.css'; // Adjust path if necessary

// --- Type Definitions ---
interface Checkpoint {
    name: string;
    type: 'Landmark' | 'Café' | 'Restaurant' | 'Museum' | 'Viewpoint' | 'Park';
    coordinates: [number, number]; // [Longitude, Latitude]
    description?: string;
}

interface RouteData {
    id: string;
    name: string;
    description: string;
    checkpoints: Checkpoint[];
}

// Map style options
interface MapStyle {
    id: string;
    name: string;
    style: string;
}

const MAP_STYLES: MapStyle[] = [
    { id: 'streets', name: 'Streets', style: 'mapbox://styles/mapbox/streets-v12' },
    { id: 'satellite', name: 'Satellite', style: 'mapbox://styles/mapbox/satellite-v9' },
    { id: 'satellite-streets', name: 'Satellite Streets', style: 'mapbox://styles/mapbox/satellite-streets-v12' },
    { id: 'outdoors', name: 'Outdoors/Terrain', style: 'mapbox://styles/mapbox/outdoors-v12' },
    { id: 'light', name: 'Light', style: 'mapbox://styles/mapbox/light-v11' },
    { id: 'dark', name: 'Dark', style: 'mapbox://styles/mapbox/dark-v11' },
];

// --- Sample Route Data (Keep as is or fetch) ---
const routesData: RouteData[] = [
    // (Your existing routesData array goes here)
    {
        id: 'old_montreal',
        name: 'Old Montreal Charm',
        description: 'Explore the historic heart of Montreal with its cobblestone streets and stunning architecture.',
        checkpoints: [
            { name: 'Notre-Dame Basilica', type: 'Landmark', coordinates: [-73.5563, 45.5046], description: 'Iconic Gothic Revival church.' },
            { name: 'Crew Collective & Café', type: 'Café', coordinates: [-73.5571, 45.5033], description: 'Stunning café in a former bank.' },
            { name: 'Place Jacques-Cartier', type: 'Landmark', coordinates: [-73.5539, 45.5074], description: 'Lively public square.' },
            { name: 'Olive + Gourmando', type: 'Restaurant', coordinates: [-73.5559, 45.5029], description: 'Popular spot for brunch/lunch.' },
            { name: 'Pointe-à-Callière Museum', type: 'Museum', coordinates: [-73.5541, 45.5031], description: 'Montreal Archaeology and History Complex.' }
        ]
    },
    {
        id: 'plateau_mont_royal',
        name: 'Plateau & Mount Royal Park',
        description: 'Discover the trendy Plateau neighborhood and enjoy nature in Mount Royal Park.',
        checkpoints: [
            { name: 'Parc La Fontaine', type: 'Park', coordinates: [-73.5698, 45.5258], description: 'Large urban park with ponds.' },
            { name: 'Schwartz\'s Deli', type: 'Restaurant', coordinates: [-73.5774, 45.5161], description: 'Famous for Montreal smoked meat.' },
            { name: 'Saint-Viateur Bagel', type: 'Café', coordinates: [-73.6039, 45.5230], description: 'Iconic Montreal bagel shop (Mile End adjacent).' },
            { name: 'Mount Royal Chalet', type: 'Viewpoint', coordinates: [-73.5872, 45.5044], description: 'Offers panoramic city views.' },
            { name: 'Beaver Lake (Lac aux Castors)', type: 'Park', coordinates: [-73.5966, 45.5018], description: 'Man-made lake in Mount Royal Park.' }
        ]
    },
    {
        id: 'downtown_discovery',
        name: 'Downtown Discovery',
        description: 'Experience the vibrant core of Montreal, from shopping centers to museums.',
        checkpoints: [
            { name: 'Montreal Museum of Fine Arts', type: 'Museum', coordinates: [-73.5798, 45.4980], description: 'Largest art museum in the city.' },
            { name: 'Mary, Queen of the World Cathedral', type: 'Landmark', coordinates: [-73.5687, 45.4987], description: 'Scale model of St. Peter\'s Basilica.' },
            { name: 'Eaton Centre / RESO', type: 'Landmark', coordinates: [-73.5710, 45.5030], description: 'Major shopping mall connected to the Underground City.' },
            { name: 'Place des Arts', type: 'Landmark', coordinates: [-73.5673, 45.5083], description: 'Major performing arts complex.' },
            { name: 'Café Parvis', type: 'Café', coordinates: [-73.5681, 45.5074], description: 'Chic cafe with a lovely terrace.' }
        ]
    }
];


// --- Map Constants ---
const ROUTE_SOURCE_ID = 'route-line-source';
const ROUTE_LAYER_ID = 'route-line-layer';

// --- Terrain Constants ---
const TERRAIN_SOURCE_ID = 'mapbox-dem';
const TERRAIN_ENABLED_STYLES = ['outdoors', 'satellite', 'satellite-streets']; // Styles where terrain will be activated

// --- Building Constants ---
const BUILDING_LAYER_ID = '3d-buildings';

// --- Helper Functions (Keep as is) ---
function getMarkerColor(type: Checkpoint['type']): string {
    // ... (same function as before)
    switch (type) {
        case 'Café': return '#d95f02'; // Orange
        case 'Restaurant': return '#e41a1c'; // Red
        case 'Landmark': return '#377eb8'; // Blue
        case 'Viewpoint': return '#4daf4a'; // Green
        case 'Museum': return '#984ea3'; // Purple
        case 'Park': return '#2b83ba'; // Different Blue/Green
        default: return '#777777'; // Grey
    }
}

function getCheckpointBgColor(type: Checkpoint['type']): string {
    // ... (same function as before)
    switch (type) {
        case 'Café': return 'bg-orange-100';
        case 'Restaurant': return 'bg-red-100';
        case 'Landmark': return 'bg-blue-100';
        case 'Viewpoint': return 'bg-green-100';
        case 'Museum': return 'bg-purple-100';
        case 'Park': return 'bg-teal-100';
        default: return 'bg-gray-100';
    }
}

// --- Component Props (Updated) ---
interface MapProps {
    MAPBOX_ACCESS_TOKEN: string;
    userEmail: string; // Add user email prop
    onSignOut: (event: React.MouseEvent) => Promise<void>; // Add sign out handler prop
}

// --- React Component (Updated) ---
const MapComponent: React.FC<MapProps> = ({
    MAPBOX_ACCESS_TOKEN,
    userEmail, // Destructure new props
    onSignOut
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapboxMap | null>(null);
    const markersRef = useRef<Marker[]>([]);
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [currentMapStyle, setCurrentMapStyle] = useState<string>(MAP_STYLES[0].id);
    const [is3DMode, setIs3DMode] = useState<boolean>(false); // Start in 2D mode

    // --- Terrain Management ---
    const enableTerrain = (map: MapboxMap) => {
        if (!map.getSource(TERRAIN_SOURCE_ID)) {
            console.log('Adding terrain source');
            map.addSource(TERRAIN_SOURCE_ID, {
                type: 'raster-dem',
                url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                tileSize: 512,
                maxzoom: 14,
            });
        }
        console.log('Setting terrain');
        map.setTerrain({ source: TERRAIN_SOURCE_ID, exaggeration: 1.5 });

        // Add sky layer for 3D effect
        if (!map.getLayer('sky')) {
            console.log('Adding sky layer');
            map.addLayer({
                id: 'sky',
                type: 'sky',
                paint: {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15,
                },
            });
        }
    };

    const disableTerrain = (map: MapboxMap) => {
        console.log('Disabling terrain');
        map.setTerrain(null);
        if (map.getLayer('sky')) {
            console.log('Removing sky layer');
            map.removeLayer('sky');
        }
        // Note: We don't remove the source, as it might be used again.
    };

    // --- 3D Buildings Management (Updated to handle visibility) ---
    const update3DBuildingsVisibility = (map: MapboxMap, visible: boolean) => {
        const layerExists = map.getLayer(BUILDING_LAYER_ID);
        console.log(`update3DBuildingsVisibility called. Visible: ${visible}, Layer Exists: ${!!layerExists}`);
        if (layerExists) {
            map.setLayoutProperty(BUILDING_LAYER_ID, 'visibility', visible ? 'visible' : 'none');
            console.log(` --> Set layout visibility to: ${visible ? 'visible' : 'none'}`);
        } else {
            console.log(` --> Layer ${BUILDING_LAYER_ID} not found, cannot set visibility.`);
        }
    };

    const add3DBuildings = (map: MapboxMap, initiallyVisible: boolean) => {
        console.log(`add3DBuildings called. InitiallyVisible: ${initiallyVisible}`);
        // Check if the layer already exists
        if (map.getLayer(BUILDING_LAYER_ID)) {
            console.log(' --> 3D buildings layer already exists. Calling update visibility.');
            update3DBuildingsVisibility(map, initiallyVisible);
            return;
        }

        // Find the ID of the first symbol layer
        let firstSymbolId;
        const layers = map.getStyle().layers;
        if (layers) {
            for (const layer of layers) {
                if (layer.type === 'symbol') {
                    firstSymbolId = layer.id;
                    break;
                }
            }
        }

        console.log(`Adding 3D buildings layer before: ${firstSymbolId || 'top'}`);

        map.addLayer(
            {
                'id': BUILDING_LAYER_ID,
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 14,
                'paint': {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        14, 0,
                        15, ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        14, 0,
                        15, ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.7
                },
                'layout': {
                    'visibility': initiallyVisible ? 'visible' : 'none' // Set initial visibility
                }
            },
            firstSymbolId // Insert before the first symbol layer or at the top if none found
        );
        console.log(` --> Added new layer ${BUILDING_LAYER_ID} with visibility: ${initiallyVisible ? 'visible' : 'none'}`);
    };

    // --- Initialize Map (Updated) ---
    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current || !MAPBOX_ACCESS_TOKEN) {
            if (!MAPBOX_ACCESS_TOKEN) {
                console.error("Mapbox Access Token is missing!");
            }
            return;
        }

        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: MAP_STYLES[0].style, // Use the first style as default
            center: [-73.5673, 45.5017], // Montreal center
            zoom: 12,
            pitch: 0, // Start with no pitch
            bearing: 0,
        });

        mapRef.current = map;

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.on('load', () => {
            console.log('Map fully loaded');
            setMapLoaded(true);

            if (!map.getSource(ROUTE_SOURCE_ID)) {
                map.addSource(ROUTE_SOURCE_ID, {
                    type: 'geojson',
                    data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } }
                });
            }
            if (!map.getLayer(ROUTE_LAYER_ID)) {
                map.addLayer({
                    id: ROUTE_LAYER_ID, type: 'line', source: ROUTE_SOURCE_ID,
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#0066FF', 'line-width': 5, 'line-opacity': 0.8, 'line-dasharray': [0, 2, 4] }
                });
            }

            // Check if initial style should have terrain
            if (TERRAIN_ENABLED_STYLES.includes(MAP_STYLES[0].id)) {
                console.log('Initial style supports terrain, enabling...');
                enableTerrain(map);
            }

            // Add 3D buildings layer, respecting initial 3D mode state
            add3DBuildings(map, is3DMode);
        });

        map.on('error', (e) => console.error('Mapbox GL Error:', e.error.message));

        return () => {
            console.log('Removing map and listeners');
            mapRef.current?.remove();
            mapRef.current = null;
            setMapLoaded(false);
        };
    }, [MAPBOX_ACCESS_TOKEN]);

    // --- Helper to redraw route and markers ---
    const redrawRouteAndMarkers = (map: MapboxMap) => {
        console.log('Attempting to redraw route and markers...');
        // Clear existing markers first
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        const currentRoute = routesData.find(r => r.id === selectedRouteId);
        const routeSource = map.getSource(ROUTE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;

        if (currentRoute && routeSource) {
            console.log(`Redrawing route: ${currentRoute.name}`);
            const coordinates = currentRoute.checkpoints.map(cp => cp.coordinates);
            routeSource.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } });

            const bounds = new LngLatBounds();
            currentRoute.checkpoints.forEach((cp, index) => {
                const el = document.createElement('div');
                el.className = 'numbered-marker';
                el.style.backgroundColor = getMarkerColor(cp.type);
                el.innerText = String(index + 1);

                const popup = new Popup({ offset: 35 }).setHTML(`
                    <h4>${cp.name}</h4>
                    <p><strong>Stop #${index + 1}</strong> - ${cp.type}</p>
                    ${cp.description ? `<p>${cp.description}</p>` : ''}
                `);

                const marker = new Marker({ element: el, anchor: 'center' })
                    .setLngLat(cp.coordinates)
                    .setPopup(popup)
                    .addTo(map);

                markersRef.current.push(marker);
                bounds.extend(cp.coordinates);
            });

            if (!bounds.isEmpty()) {
                // Check if map is pitched; adjust padding if necessary
                const padding = map.getPitch() > 20
                    ? { top: 100, bottom: 150, left: 370, right: 70 } // More padding when pitched
                    : { top: 70, bottom: 70, left: 370, right: 70 };
                map.fitBounds(bounds, { padding, maxZoom: 15, duration: 500 });
            }
        } else {
            console.log('No selected route or route source not ready for redraw.');
            // Ensure route line is cleared if no route selected
            if (routeSource) {
                routeSource.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } });
            }
        }
    };

    // Handle map style changes (Updated)
    const handleMapStyleChange = (styleId: string) => {
        const map = mapRef.current;
        if (!map || !mapLoaded) return;

        const selectedStyle = MAP_STYLES.find(s => s.id === styleId);
        if (selectedStyle) {
            console.log(`Changing style to: ${styleId}`);
            setCurrentMapStyle(styleId); // Update state before setting style
            map.setStyle(selectedStyle.style);

            // Add a ONE-TIME listener for this specific style change
            map.once('style.load', () => {
                console.log(`Style Load specific handler for: ${styleId}`);
                console.log(` --> is3DMode inside handler: ${is3DMode}`);
                const currentMap = mapRef.current; // Re-get ref inside callback
                if (!currentMap) return;

                // Ensure route source/layer are present (needed before adding route data/markers)
                if (!currentMap.getSource(ROUTE_SOURCE_ID)) {
                    console.log('(Style Change) Re-adding route source post style load');
                    currentMap.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } } });
                }
                if (!currentMap.getLayer(ROUTE_LAYER_ID)) {
                    console.log('(Style Change) Re-adding route layer post style load');
                    currentMap.addLayer({ id: ROUTE_LAYER_ID, type: 'line', source: ROUTE_SOURCE_ID, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#0066FF', 'line-width': 5, 'line-opacity': 0.8, 'line-dasharray': [0, 2, 4] } });
                }

                // Apply settings based on CURRENT mode and NEW style
                currentMap.setPitch(is3DMode ? 45 : 0); // Apply correct pitch
                if (is3DMode && TERRAIN_ENABLED_STYLES.includes(styleId)) {
                    enableTerrain(currentMap);
                } else {
                    disableTerrain(currentMap);
                }
                add3DBuildings(currentMap, is3DMode); // Add/show/hide buildings

                // Redraw route and markers
                redrawRouteAndMarkers(currentMap);
            });
        }
    };

    // --- Handle 2D/3D Toggle (Updated) ---
    const handle3DModeToggle = (checked: boolean) => {
        setIs3DMode(checked);
        const map = mapRef.current;
        if (!map || !mapLoaded) return;

        if (checked) {
            // Entering 3D Mode
            console.log('Switching to 3D Mode');
            map.setPitch(45, { duration: 500 }); // Set pitch immediately for smoother feel

            // Find the current style URL
            const selectedStyle = MAP_STYLES.find(s => s.id === currentMapStyle);

            if (selectedStyle) {
                console.log('Forcing style reload to ensure proper 3D initialization...');
                map.setStyle(selectedStyle.style);

                // Add a ONE-TIME listener for this specific style reload
                map.once('style.load', () => {
                    console.log(`Style Load specific handler for: 3D Toggle ON`);
                    console.log(` --> is3DMode inside handler: ${is3DMode}`); // Should always be true here
                    const currentMap = mapRef.current; // Re-get ref inside callback
                    if (!currentMap) return;

                    // Ensure route source/layer are present
                    if (!currentMap.getSource(ROUTE_SOURCE_ID)) {
                        console.log('(3D Toggle) Re-adding route source post style load');
                        currentMap.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } } });
                    }
                    if (!currentMap.getLayer(ROUTE_LAYER_ID)) {
                        console.log('(3D Toggle) Re-adding route layer post style load');
                        currentMap.addLayer({ id: ROUTE_LAYER_ID, type: 'line', source: ROUTE_SOURCE_ID, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#0066FF', 'line-width': 5, 'line-opacity': 0.8, 'line-dasharray': [0, 2, 4] } });
                    }

                    // Apply 3D settings
                    currentMap.setPitch(45); // Ensure pitch is set
                    if (TERRAIN_ENABLED_STYLES.includes(currentMapStyle)) {
                        enableTerrain(currentMap);
                    }
                    add3DBuildings(currentMap, true); // Show buildings

                    // Redraw route and markers
                    redrawRouteAndMarkers(currentMap);
                });

            } else {
                // Fallback: If style somehow not found, attempt direct enable (might glitch)
                console.warn('Current style not found, attempting direct 3D enable.');
                if (TERRAIN_ENABLED_STYLES.includes(currentMapStyle)) {
                    enableTerrain(map);
                }
                update3DBuildingsVisibility(map, true);
            }

        } else {
            // Entering 2D Mode
            console.log('Switching to 2D Mode');
            map.setPitch(0, { duration: 500 }); // Animate pitch back
            disableTerrain(map); // Always disable terrain in 2D
            update3DBuildingsVisibility(map, false);
        }
    };

    // --- Handle Route Selection and Drawing (Updated - simplified) ---
    useEffect(() => {
        const map = mapRef.current;
        // Only try to draw if map exists, is loaded, and style is loaded.
        // Redrawing after style changes is now handled by the 'style.load' listeners.
        if (!map || !mapLoaded || !map.isStyleLoaded()) {
            console.log('Route drawing effect: Map or style not ready.');
            return;
        }

        console.log('Route selection changed, triggering redraw...');
        // Simply call the redraw helper. It handles clearing/drawing based on selectedRouteId.
        redrawRouteAndMarkers(map);

        // Depend only on selectedRouteId and mapLoaded. Style readiness is checked inside.
    }, [selectedRouteId, mapLoaded]); // mapLoaded ensures initial setup is done

    // --- Render Logic (Updated) ---
    const handleSelectRoute = (routeId: string) => {
        setSelectedRouteId(routeId);
    };

    const currentRouteDetails = routesData.find(r => r.id === selectedRouteId);

    return (
        // Main container takes full screen
        <div className="flex h-screen w-full bg-background text-foreground">
            {/* Sidebar */}
            <Card className="w-[350px] flex flex-col rounded-none border-0 border-r">
                {/* Updated Header with User Info and Sign Out */}
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center mb-2">
                        <CardTitle>Montreal Routes</CardTitle>
                        <Button variant="outline" size="sm" onClick={onSignOut}> {/* Use passed handler */}
                            Sign Out
                        </Button>
                    </div>
                    <CardDescription>
                        Welcome, <span className="font-medium">{userEmail}</span>! Select a route.
                    </CardDescription>
                </CardHeader>

                {/* Map Style Selector */}
                <div className="p-6 border-b">
                    <label className="block text-sm font-medium mb-2">Map Style</label>
                    <Select value={currentMapStyle} onValueChange={handleMapStyleChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select map style" />
                        </SelectTrigger>
                        <SelectContent>
                            {MAP_STYLES.map(style => (
                                <SelectItem key={style.id} value={style.id}>
                                    {style.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 2D/3D Toggle */}
                <div className="px-6 pb-6 border-b flex items-center justify-between">
                    <Label htmlFor="3d-mode-switch" className="text-sm font-medium">3D View</Label>
                    <Switch
                        id="3d-mode-switch"
                        checked={is3DMode}
                        onCheckedChange={handle3DModeToggle}
                    />
                </div>

                {/* Add some instructions for terrain */}
                <div className="px-6 pt-4 pb-4 text-xs text-muted-foreground"> {/* Adjusted padding */}
                    Select a style like 'Outdoors/Terrain', 'Satellite', or 'Streets'. Use Ctrl + Drag (or Cmd + Drag on Mac) to rotate and pitch the map for 3D terrain/buildings.
                </div>

                {/* Rest of the Sidebar Content */}
                <CardContent className="flex-grow flex flex-col p-0">
                    {/* Route List */}
                    <ScrollArea className="flex-grow px-6 pt-2"> {/* Adjusted padding */}
                        <ul className="list-none p-0 m-0">
                            {routesData.map((route) => (
                                <li
                                    key={route.id}
                                    onClick={() => handleSelectRoute(route.id)}
                                    className={`
                                        p-3 mb-2 border rounded-md cursor-pointer transition-colors duration-150 ease-in-out
                                        hover:bg-muted/80 hover:border-muted-foreground/50
                                        ${selectedRouteId === route.id
                                            ? 'bg-primary text-primary-foreground border-primary/80 hover:bg-primary/90 hover:border-primary'
                                            : 'bg-card '
                                        }
                                    `}
                                >
                                    {route.name}
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>

                    {/* Route Details */}
                    <div className="p-6 border-t mt-auto"> {/* Keep details at bottom */}
                        <ScrollArea className="h-[300px] pr-3"> {/* Max height for details */}
                            {currentRouteDetails ? (
                                <>
                                    <h3 className="text-lg font-semibold mb-2">{currentRouteDetails.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{currentRouteDetails.description}</p>
                                    <h4 className="text-md font-semibold mb-2">Checkpoints:</h4>
                                    <ul className="list-none p-0 space-y-2">
                                        {currentRouteDetails.checkpoints.map((cp, index) => (
                                            <li key={index} className={`p-2 rounded-md text-sm ${getCheckpointBgColor(cp.type)} border border-border/30`}>
                                                <strong className="font-medium block">{cp.name}</strong> ({cp.type})
                                                {cp.description && <span className="block text-muted-foreground text-xs italic mt-1">{cp.description}</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">Select a route to see details.</p>
                            )}
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>

            {/* Map Container (Keep as is) */}
            <div ref={mapContainerRef} className="flex-grow h-full relative">
                {!MAPBOX_ACCESS_TOKEN && (
                    <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center z-10">
                        <p className="text-destructive font-semibold text-lg p-4 bg-background rounded">Mapbox Access Token is missing!</p>
                    </div>
                )}
                {!mapLoaded && MAPBOX_ACCESS_TOKEN && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <p className="text-foreground font-semibold text-lg p-4 bg-muted rounded">Loading Map...</p>
                    </div>
                )}
                {/* Map div is rendered here by Mapbox */}
            </div>
        </div>
    );
};

export default MapComponent;