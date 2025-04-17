// src/App.jsx
import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import WorldMap from './components/WorldMap';
import CountryInfoPopup from './components/CountryInfoPopup';
import countryInfoData from './data/countryInfo.json';

function App() {
  const [hoveredCountryId, setHoveredCountryId] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedCountryName, setSelectedCountryName] = useState(null);

  const handleCountryClick = useCallback((countryId, countryName) => {
    console.log("Clicked Country ID:", countryId, "Name:", countryName);
    setSelectedCountryId(countryId);
    setSelectedCountryName(countryName);
  }, []);

  const handleCountryHover = useCallback((countryId) => {
    setHoveredCountryId(countryId);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedCountryId(null);
    setSelectedCountryName(null);
  }, []);

  const selectedCountryData = useMemo(() => {
    if (!selectedCountryId && !selectedCountryName) return null;
    let foundCountry = null;
    if (selectedCountryId) {
      foundCountry = countryInfoData.find(country =>
        country.cca3?.toLowerCase() === selectedCountryId.toLowerCase()
      );
    }
    if (!foundCountry && selectedCountryName) {
      console.log(`ID lookup failed for ${selectedCountryId}. Trying name lookup for: ${selectedCountryName}`);
      foundCountry = countryInfoData.find(country =>
        country.name?.common?.toLowerCase() === selectedCountryName.toLowerCase()
      );
    }
     if (!foundCountry && selectedCountryName) {
         console.warn(`No detailed data found for ID: ${selectedCountryId}, Name: ${selectedCountryName}. Returning basic info.`);
         return { name: { common: selectedCountryName }, cca3: selectedCountryId, partialData: true };
    }
    if (foundCountry) {
      console.log("Found country data:", foundCountry.name?.common);
    } else {
      console.warn(`No data found for ID: ${selectedCountryId}, Name: ${selectedCountryName}`);
    }
    return foundCountry;
  }, [selectedCountryId, selectedCountryName]);


  return (
    <div className="min-h-screen flex flex-col bg-primary-light dark:bg-primary-dark text-gray-800 dark:text-gray-200">
      <Header />
      {/* Ensure main tag correctly takes up remaining space */}
      <main className="flex-grow flex flex-col items-stretch justify-stretch relative overflow-hidden">
        {/* The container div will be styled by the .globe-container class in index.css */}
        {/* Removed specific w-full, h-full, flex-grow classes here to rely on the CSS rule */}
        <div className="globe-container">
          <WorldMap
            onCountryClick={handleCountryClick}
            onCountryHover={handleCountryHover}
          />
        </div>
      </main>
      <Footer />

      <CountryInfoPopup
        countryData={selectedCountryData}
        onClose={handleClosePopup}
      />
    </div>
  );
}

export default App;