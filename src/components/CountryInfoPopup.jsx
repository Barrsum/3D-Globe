// src/components/CountryInfoPopup.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaMapMarkedAlt } from 'react-icons/fa'; // Added map icon

// Helper function to format population numbers
const formatPopulation = (pop) => {
  if (pop === undefined || pop === null) return 'N/A';
  return pop.toLocaleString(); // Adds commas (e.g., 1,234,567)
};

// Helper function to get currency info string
const getCurrencyInfo = (currencies) => {
  if (!currencies || Object.keys(currencies).length === 0) return 'N/A';
  // Get info for the first currency listed
  const firstCurrencyCode = Object.keys(currencies)[0];
  const currency = currencies[firstCurrencyCode];
  return `${currency.name || 'N/A'} (${currency.symbol || firstCurrencyCode})`;
};

// Helper function to get languages string
const getLanguages = (languages) => {
  if (!languages || Object.keys(languages).length === 0) return 'N/A';
  return Object.values(languages).join(', ');
};

function CountryInfoPopup({ countryData, onClose }) {
  // If no data, don't render anything
  if (!countryData) return null;

  // Extract data safely using optional chaining
  const commonName = countryData.name?.common || 'Country Information';
  const officialName = countryData.name?.official || '';
  const flagUrl = countryData.flags?.svg; // Prefer SVG for quality
  const flagAlt = countryData.flags?.alt || `Flag of ${commonName}`;
  const capital = countryData.capital?.[0] || 'N/A';
  const population = formatPopulation(countryData.population);
  const region = countryData.region || 'N/A';
  const subregion = countryData.subregion || 'N/A';
  const currencyInfo = getCurrencyInfo(countryData.currencies);
  const languages = getLanguages(countryData.languages);
  const mapsLink = countryData.maps?.googleMaps;

  // Handle the case where only partial data (just name/id) was found in App.jsx
  if (countryData.partialData) {
     return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center p-4 z-50 animate-fade-in" onClick={onClose}>
          <div className="bg-secondary-light dark:bg-secondary-dark rounded-lg shadow-2xl p-6 w-full max-w-xs sm:max-w-sm relative text-gray-800 dark:text-gray-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent" aria-label="Close popup" title="Close">
              <FaTimes size={20} />
            </button>
             <h2 className="text-xl sm:text-2xl font-bold mb-4 text-accent dark:text-blue-300">{commonName}</h2>
             <p className="text-sm text-gray-500 dark:text-gray-400 italic">Detailed information not available in the local dataset.</p>
             {mapsLink && (
               <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mt-4">
                 <FaMapMarkedAlt className="mr-1" /> View on Google Maps
               </a>
             )}
          </div>
        </div>
     );
  }

  // Full data display
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 flex justify-center items-center p-4 z-50 animate-fade-in"
      onClick={onClose} // Click outside to close
    >
      <div
        className="bg-primary-light dark:bg-secondary-dark rounded-xl shadow-2xl p-5 sm:p-6 w-full max-w-sm md:max-w-md relative text-gray-800 dark:text-gray-100 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent dark:focus:ring-offset-secondary-dark"
          aria-label="Close popup"
          title="Close"
        >
          <FaTimes size={18} />
        </button>

        {/* Header section with Flag */}
        <div className="flex items-start mb-4 pr-8"> {/* Added padding-right for close button */}
          {flagUrl && (
            <img src={flagUrl} alt={flagAlt} className="w-16 h-auto mr-4 border border-gray-300 dark:border-gray-600 rounded-sm shadow-sm" />
          )}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-accent dark:text-blue-300 leading-tight">{commonName}</h2>
            {officialName && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{officialName}</p>}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-3 text-sm sm:text-base border-t border-gray-200 dark:border-gray-700 pt-4">
          <p><span className="font-semibold w-24 inline-block">Capital:</span> {capital}</p>
          <p><span className="font-semibold w-24 inline-block">Population:</span> {population}</p>
          <p><span className="font-semibold w-24 inline-block">Region:</span> {region} {subregion ? `(${subregion})` : ''}</p>
          <p><span className="font-semibold w-24 inline-block">Currency:</span> {currencyInfo}</p>
          <p><span className="font-semibold w-24 inline-block">Languages:</span> {languages}</p>
          {/* Add more details as needed, e.g., area, borders */}
          {countryData.area && <p><span className="font-semibold w-24 inline-block">Area:</span> {countryData.area.toLocaleString()} km²</p>}
        </div>

         {/* Google Maps Link */}
         {mapsLink && (
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
              >
                  <FaMapMarkedAlt className="mr-1.5" /> View on Google Maps
              </a>
            </div>
         )}
      </div>
    </div>
  );
}

// Updated PropTypes
CountryInfoPopup.propTypes = {
  countryData: PropTypes.shape({
    name: PropTypes.shape({
      common: PropTypes.string,
      official: PropTypes.string,
    }),
    cca3: PropTypes.string,
    capital: PropTypes.arrayOf(PropTypes.string),
    population: PropTypes.number,
    region: PropTypes.string,
    subregion: PropTypes.string,
    currencies: PropTypes.object,
    languages: PropTypes.object,
    flags: PropTypes.shape({
      svg: PropTypes.string,
      png: PropTypes.string,
      alt: PropTypes.string,
    }),
    maps: PropTypes.shape({
        googleMaps: PropTypes.string,
    }),
    area: PropTypes.number,
    partialData: PropTypes.bool
  }),
  onClose: PropTypes.func.isRequired,
};

export default CountryInfoPopup;