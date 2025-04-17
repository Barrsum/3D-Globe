// src/components/WorldMap.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';
import PropTypes from 'prop-types';
import { useTheme } from '../contexts/ThemeContext';
// *** STEP 1: Import your custom India boundary data ***
import indiaBoundaryData from '../data/indiaBoundary.json';

// --- Constants ---
const GLOBE_IMAGE_URL_LIGHT = '//unpkg.com/three-globe/example/img/earth-day.jpg';
const GLOBE_IMAGE_URL_DARK = '//unpkg.com/three-globe/example/img/earth-night.jpg';
const BACKGROUND_IMAGE_URL = '//unpkg.com/three-globe/example/img/night-sky.png';
const GEOJSON_URL = 'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';
const INITIAL_ALTITUDE = 2.5;
const HOVER_ALTITUDE_FACTOR = 0.03;
const CLICK_ZOOM_ALTITUDE = 1.2;
const FLY_TO_DURATION = 1500;
// Define a unique color for the India boundary line
const INDIA_BOUNDARY_COLOR_LIGHT = 'rgba(220, 38, 38, 0.9)'; // Red in light mode
const INDIA_BOUNDARY_COLOR_DARK = 'rgba(250, 170, 20, 0.9)'; // Orange/Yellow in dark mode

function WorldMap({ onCountryClick, onCountryHover }) {
  // --- Refs ---
  const globeEl = useRef();

  // --- State ---
  const [countries, setCountries] = useState({ features: [] });
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Context ---
  const { theme } = useTheme();

  // --- Effects ---

  // Fetch GeoJSON data for the world polygons
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    let isMounted = true;

    fetch(GEOJSON_URL)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error loading GeoJSON! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setCountries(data);
          console.log("World GeoJSON data loaded successfully.");
        }
      })
      .catch(err => {
        console.error("Failed to fetch World GeoJSON data:", err);
        if (isMounted) setError("Could not load base map data. Please try again later.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false); // Set loading false even if data loading continues elsewhere
      });

    return () => { isMounted = false; };
  }, []);

  // Handle container resize
  const resizeObserver = useMemo(() => new ResizeObserver(entries => {
    const entry = entries[0];
    if (entry) {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setContainerSize(prevSize => {
          if (prevSize.width !== width || prevSize.height !== height) {
            return { width, height };
          }
          return prevSize;
        });
      }
    }
  }), []);

  const containerRef = useCallback(node => {
    if (node !== null) {
      resizeObserver.observe(node);
       // Get initial size immediately
       const { width, height } = node.getBoundingClientRect();
       if (width > 0 && height > 0) {
          // console.log(`ResizeObserver: Initial size check - Width: ${width}, Height: ${height}`);
          setContainerSize({ width, height });
       } else {
          console.warn("ResizeObserver: Initial measurement yielded zero dimensions.");
       }
    } else {
      resizeObserver.disconnect();
    }
  }, [resizeObserver]); // No containerSize dependency needed here

  // Set up globe controls
  useEffect(() => {
    const controls = globeEl.current?.controls();
    const renderer = globeEl.current?.renderer();
    if (controls && renderer && containerSize.width > 0 && containerSize.height > 0) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.20;
      controls.enableZoom = true;
      controls.minDistance = 150;
      controls.maxDistance = 700;
      controls.enablePan = false;

      const timeoutId = setTimeout(() => {
          if (globeEl.current) {
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: INITIAL_ALTITUDE }, FLY_TO_DURATION / 2);
          }
      }, 100);

       const mapCanvas = renderer.domElement;
       if (mapCanvas) {
          mapCanvas.style.cursor = 'grab';
          const setGrabbing = () => mapCanvas.style.cursor = 'grabbing';
          const setGrab = () => mapCanvas.style.cursor = 'grab';
          mapCanvas.addEventListener('mousedown', setGrabbing);
          mapCanvas.addEventListener('mouseup', setGrab);
          return () => {
              clearTimeout(timeoutId);
              mapCanvas.removeEventListener('mousedown', setGrabbing);
              mapCanvas.removeEventListener('mouseup', setGrab);
          };
       }
       return () => clearTimeout(timeoutId);
    }
  }, [containerSize.width, containerSize.height]); // Rerun if size changes (e.g., orientation change)


  // --- Data Processing ---

  // *** STEP 2: Process your India LineString data for the pathsData prop ***
  const indiaPathData = useMemo(() => {
    if (!indiaBoundaryData?.features?.[0]?.geometry?.coordinates) {
        console.error("India boundary data is not in the expected format.");
        return []; // Return empty array if data is bad
    }
    const pathCoords = indiaBoundaryData.features[0].geometry.coordinates;
    return [{ // react-globe.gl expects an array of path objects
      points: pathCoords.map(p => [p[1], p[0], 0.015]), // Swap [lng, lat] to [lat, lng] & add slight altitude
      name: "India Boundary (Official)", // Optional identifier
      color: theme === 'dark' ? INDIA_BOUNDARY_COLOR_DARK : INDIA_BOUNDARY_COLOR_LIGHT, // Dynamic color
      stroke: 1.5, // Make it slightly thicker
    }];
  }, [theme]); // Recalculate if theme changes for color update

  // --- Memoized Callbacks & Styles for Polygons ---

  const polygonCapColor = useCallback((feature) => {
    const isHovered = feature === hoveredPolygon;
    // Make default India polygon less visible if desired
    // if (feature.properties.ADMIN === 'India' || feature.properties.ADM0_A3 === 'IND') {
    //   return 'rgba(0,0,0,0.05)'; // Almost transparent
    // }
    if (isHovered) return theme === 'dark' ? 'rgba(220, 220, 255, 0.7)' : 'rgba(0, 0, 100, 0.6)';
    return theme === 'dark' ? 'rgba(100, 100, 180, 0.3)' : 'rgba(150, 150, 200, 0.3)';
  }, [hoveredPolygon, theme]);

  const polygonSideColor = useCallback(() => (
    theme === 'dark' ? 'rgba(150, 150, 200, 0.05)' : 'rgba(0, 0, 0, 0.1)'
  ), [theme]);

  const polygonStrokeColor = useCallback(() => (
    theme === 'dark' ? 'rgba(180, 180, 220, 0.6)' : 'rgba(80, 80, 100, 0.7)'
  ), [theme]);

  const polygonAltitude = useCallback(feat => (
    feat === hoveredPolygon ? HOVER_ALTITUDE_FACTOR : 0.01
  ), [hoveredPolygon]);

  const polygonLabel = useCallback(({ properties: d }) => `
    <div style="background-color: rgba(30, 30, 30, 0.8); color: white; padding: 3px 6px; border-radius: 4px; font-size: 0.85em; text-shadow: 1px 1px 1px black;">
      <b>${d.ADMIN || d.NAME}</b>
    </div>
  `, []);

  // --- Interaction Handlers ---

  const handlePolygonHover = useCallback((polygon) => {
    setHoveredPolygon(polygon);
    const countryId = polygon ? polygon.properties.ADM0_A3 || polygon.properties.ISO_A3 : null;
    onCountryHover(countryId);
    const mapCanvas = globeEl.current?.renderer()?.domElement;
    if (mapCanvas) {
      mapCanvas.style.cursor = polygon ? 'pointer' : 'grab';
    }
  }, [onCountryHover]);

  const handlePolygonClick = useCallback((polygon) => {
    if (!polygon) return;

    const controls = globeEl.current?.controls();
    if (controls) controls.autoRotate = false;

    const mapCanvas = globeEl.current?.renderer()?.domElement;
    if(mapCanvas) mapCanvas.style.cursor = 'pointer';

     const countryId = polygon.properties.ADM0_A3 || polygon.properties.ISO_A3;
     const countryName = polygon.properties.ADMIN || polygon.properties.NAME;

     if (!countryId || !countryName) {
        console.error("Could not extract country ID or Name from GeoJSON properties:", polygon.properties);
        return;
     }

     onCountryClick(countryId, countryName);

    // Fly-to animation
    try {
        const coords = polygon.properties.LABEL_COORD;
        const bbox = polygon.bbox;
        if (coords && globeEl.current) {
             globeEl.current.pointOfView({ lat: coords[1], lng: coords[0], altitude: CLICK_ZOOM_ALTITUDE }, FLY_TO_DURATION);
        } else if (bbox && globeEl.current) {
            const centerLat = (bbox[1] + bbox[3]) / 2;
            const centerLng = (bbox[0] + bbox[2]) / 2;
            const altitude = Math.max(0.5, Math.min(CLICK_ZOOM_ALTITUDE + 0.5, (Math.max(bbox[2] - bbox[0], bbox[3] - bbox[1])) / 40));
            globeEl.current.pointOfView({ lat: centerLat, lng: centerLng, altitude: altitude }, FLY_TO_DURATION);
        } else {
            globeEl.current?.pointOfView({ altitude: CLICK_ZOOM_ALTITUDE }, FLY_TO_DURATION);
        }
    } catch (e) {
      console.error("Error during fly-to animation:", e);
      globeEl.current?.pointOfView({ altitude: CLICK_ZOOM_ALTITUDE }, FLY_TO_DURATION);
    }
  }, [onCountryClick]);

  // --- Render Logic ---

  const isReady = containerSize.width > 0 && containerSize.height > 0 && countries.features.length > 0 && !isLoading;
  console.log('WorldMap Rendering Check:', { isReady, isLoading, width: containerSize.width, height: containerSize.height, featuresCount: countries.features.length, errorState: error });

  return (
    <div ref={containerRef} className="globe-container">
      {/* Loading/Error/Initializing States */}
      {isLoading && !error && (
           <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-primary-light dark:bg-primary-dark z-10 pointer-events-none">
              <p className="animate-pulse text-lg font-semibold">Loading Map Data...</p>
           </div>
       )}
      {error && (
           <div className="absolute inset-0 flex items-center justify-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 z-10 pointer-events-none">
              <p className="text-center font-semibold">{error}</p>
           </div>
      )}
      {!isLoading && !error && (containerSize.width === 0 || containerSize.height === 0) && (
           <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-primary-light dark:bg-primary-dark z-10 pointer-events-none">
              <p className="text-lg font-semibold">Initializing Map View...</p>
           </div>
      )}

      {/* Globe Component - Render when ready */}
       {isReady && !error && (
        <Globe
          ref={globeEl}
          width={containerSize.width}
          height={containerSize.height}
          // Appearance
          globeImageUrl={theme === 'dark' ? GLOBE_IMAGE_URL_DARK : GLOBE_IMAGE_URL_LIGHT}
          backgroundImageUrl={BACKGROUND_IMAGE_URL}
          atmosphereColor={theme === 'dark' ? '#3B82F6' : '#93C5FD'}
          atmosphereAltitude={0.28}

          // Polygons (World minus Antarctica)
          polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
          polygonCapColor={polygonCapColor}
          polygonSideColor={polygonSideColor}
          polygonStrokeColor={polygonStrokeColor}
          polygonAltitude={polygonAltitude}
          polygonLabel={polygonLabel}
          onPolygonHover={handlePolygonHover}
          onPolygonClick={handlePolygonClick}
          polygonsTransitionDuration={100}

          // *** STEP 3: Add the Paths for India Boundary ***
          pathsData={indiaPathData} // Your processed India line data
          pathPoints="points"       // Accessor for the points array in each path object
          pathPointLat={p => p[0]}  // Accessor for latitude in each point
          pathPointLng={p => p[1]}  // Accessor for longitude in each point
          pathPointAlt={p => p[2]}  // Accessor for altitude
          pathColor={path => path.color} // Use the color property set in useMemo
          pathStroke={path => path.stroke} // Use the stroke property set in useMemo
          // pathDashLength={0.05} // Optional: Dashed line style
          // pathDashGap={0.02}
          // pathDashAnimateTime={10000} // Optional: Animate the dashes
          pathTransitionDuration={0} // No transition needed

          // Labels/Quality
          polygonLabelSize={0.7}
          polygonLabelDotRadius={0.3}
          polygonLabelColor={() => 'rgba(255, 255, 255, 0.85)'}
          polygonLabelResolution={2}
          polygonLabelDotOrientation={'bottom'}
        />
      )}
    </div>
  );
}

// --- PropTypes ---
WorldMap.propTypes = {
  onCountryClick: PropTypes.func.isRequired,
  onCountryHover: PropTypes.func.isRequired,
};

export default WorldMap;