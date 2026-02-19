/**
 * Maps country codes to continents and country names
 * Based on ISO 3166-1 alpha-2 country codes
 */

export const COUNTRY_TO_CONTINENT_MAP = {
  // Africa
  DZ: { continent: "Africa", name: "Algeria" },
  AO: { continent: "Africa", name: "Angola" },
  BJ: { continent: "Africa", name: "Benin" },
  BW: { continent: "Africa", name: "Botswana" },
  BF: { continent: "Africa", name: "Burkina Faso" },
  BI: { continent: "Africa", name: "Burundi" },
  CV: { continent: "Africa", name: "Cape Verde" },
  CM: { continent: "Africa", name: "Cameroon" },
  CF: { continent: "Africa", name: "Central African Republic" },
  TD: { continent: "Africa", name: "Chad" },
  KM: { continent: "Africa", name: "Comoros" },
  CG: { continent: "Africa", name: "Republic of the Congo" },
  CD: { continent: "Africa", name: "Democratic Republic of the Congo" },
  CI: { continent: "Africa", name: "Ivory Coast" },
  DJ: { continent: "Africa", name: "Djibouti" },
  EG: { continent: "Africa", name: "Egypt" },
  GQ: { continent: "Africa", name: "Equatorial Guinea" },
  ER: { continent: "Africa", name: "Eritrea" },
  SZ: { continent: "Africa", name: "Eswatini" },
  ET: { continent: "Africa", name: "Ethiopia" },
  GA: { continent: "Africa", name: "Gabon" },
  GM: { continent: "Africa", name: "Gambia" },
  GH: { continent: "Africa", name: "Ghana" },
  GN: { continent: "Africa", name: "Guinea" },
  GW: { continent: "Africa", name: "Guinea-Bissau" },
  KE: { continent: "Africa", name: "Kenya" },
  LS: { continent: "Africa", name: "Lesotho" },
  LR: { continent: "Africa", name: "Liberia" },
  LY: { continent: "Africa", name: "Libya" },
  MG: { continent: "Africa", name: "Madagascar" },
  MW: { continent: "Africa", name: "Malawi" },
  ML: { continent: "Africa", name: "Mali" },
  MR: { continent: "Africa", name: "Mauritania" },
  MU: { continent: "Africa", name: "Mauritius" },
  YT: { continent: "Africa", name: "Mayotte" },
  MA: { continent: "Africa", name: "Morocco" },
  MZ: { continent: "Africa", name: "Mozambique" },
  NA: { continent: "Africa", name: "Namibia" },
  NE: { continent: "Africa", name: "Niger" },
  NG: { continent: "Africa", name: "Nigeria" },
  RE: { continent: "Africa", name: "Réunion" },
  RW: { continent: "Africa", name: "Rwanda" },
  SH: { continent: "Africa", name: "Saint Helena" },
  ST: { continent: "Africa", name: "São Tomé and Príncipe" },
  SN: { continent: "Africa", name: "Senegal" },
  SC: { continent: "Africa", name: "Seychelles" },
  SL: { continent: "Africa", name: "Sierra Leone" },
  SO: { continent: "Africa", name: "Somalia" },
  ZA: { continent: "Africa", name: "South Africa" },
  SS: { continent: "Africa", name: "South Sudan" },
  SD: { continent: "Africa", name: "Sudan" },
  TZ: { continent: "Africa", name: "Tanzania" },
  TG: { continent: "Africa", name: "Togo" },
  TN: { continent: "Africa", name: "Tunisia" },
  UG: { continent: "Africa", name: "Uganda" },
  EH: { continent: "Africa", name: "Western Sahara" },
  ZM: { continent: "Africa", name: "Zambia" },
  ZW: { continent: "Africa", name: "Zimbabwe" },

  // Asia
  AF: { continent: "Asia", name: "Afghanistan" },
  AM: { continent: "Asia", name: "Armenia" },
  AZ: { continent: "Asia", name: "Azerbaijan" },
  BH: { continent: "Asia", name: "Bahrain" },
  BD: { continent: "Asia", name: "Bangladesh" },
  BT: { continent: "Asia", name: "Bhutan" },
  BN: { continent: "Asia", name: "Brunei" },
  KH: { continent: "Asia", name: "Cambodia" },
  CN: { continent: "Asia", name: "China" },
  CY: { continent: "Asia", name: "Cyprus" },
  GE: { continent: "Asia", name: "Georgia" },
  IN: { continent: "Asia", name: "India" },
  ID: { continent: "Asia", name: "Indonesia" },
  IR: { continent: "Asia", name: "Iran" },
  IQ: { continent: "Asia", name: "Iraq" },
  IL: { continent: "Asia", name: "Israel" },
  JP: { continent: "Asia", name: "Japan" },
  JO: { continent: "Asia", name: "Jordan" },
  KZ: { continent: "Asia", name: "Kazakhstan" },
  KW: { continent: "Asia", name: "Kuwait" },
  KG: { continent: "Asia", name: "Kyrgyzstan" },
  LA: { continent: "Asia", name: "Laos" },
  LB: { continent: "Asia", name: "Lebanon" },
  MY: { continent: "Asia", name: "Malaysia" },
  MV: { continent: "Asia", name: "Maldives" },
  MN: { continent: "Asia", name: "Mongolia" },
  MM: { continent: "Asia", name: "Myanmar" },
  NP: { continent: "Asia", name: "Nepal" },
  KP: { continent: "Asia", name: "North Korea" },
  OM: { continent: "Asia", name: "Oman" },
  PK: { continent: "Asia", name: "Pakistan" },
  PS: { continent: "Asia", name: "Palestine" },
  PH: { continent: "Asia", name: "Philippines" },
  QA: { continent: "Asia", name: "Qatar" },
  SA: { continent: "Asia", name: "Saudi Arabia" },
  SG: { continent: "Asia", name: "Singapore" },
  KR: { continent: "Asia", name: "South Korea" },
  LK: { continent: "Asia", name: "Sri Lanka" },
  SY: { continent: "Asia", name: "Syria" },
  TW: { continent: "Asia", name: "Taiwan" },
  TJ: { continent: "Asia", name: "Tajikistan" },
  TH: { continent: "Asia", name: "Thailand" },
  TL: { continent: "Asia", name: "East Timor" },
  TR: { continent: "Asia", name: "Turkey" },
  TM: { continent: "Asia", name: "Turkmenistan" },
  AE: { continent: "Asia", name: "United Arab Emirates" },
  UZ: { continent: "Asia", name: "Uzbekistan" },
  VN: { continent: "Asia", name: "Vietnam" },
  YE: { continent: "Asia", name: "Yemen" },

  // Europe
  AL: { continent: "Europe", name: "Albania" },
  AD: { continent: "Europe", name: "Andorra" },
  AT: { continent: "Europe", name: "Austria" },
  BY: { continent: "Europe", name: "Belarus" },
  BE: { continent: "Europe", name: "Belgium" },
  BA: { continent: "Europe", name: "Bosnia and Herzegovina" },
  BG: { continent: "Europe", name: "Bulgaria" },
  HR: { continent: "Europe", name: "Croatia" },
  CZ: { continent: "Europe", name: "Czech Republic" },
  DK: { continent: "Europe", name: "Denmark" },
  EE: { continent: "Europe", name: "Estonia" },
  FI: { continent: "Europe", name: "Finland" },
  FR: { continent: "Europe", name: "France" },
  DE: { continent: "Europe", name: "Germany" },
  GR: { continent: "Europe", name: "Greece" },
  HU: { continent: "Europe", name: "Hungary" },
  IS: { continent: "Europe", name: "Iceland" },
  IE: { continent: "Europe", name: "Ireland" },
  IT: { continent: "Europe", name: "Italy" },
  XK: { continent: "Europe", name: "Kosovo" },
  LV: { continent: "Europe", name: "Latvia" },
  LI: { continent: "Europe", name: "Liechtenstein" },
  LT: { continent: "Europe", name: "Lithuania" },
  LU: { continent: "Europe", name: "Luxembourg" },
  MT: { continent: "Europe", name: "Malta" },
  MD: { continent: "Europe", name: "Moldova" },
  MC: { continent: "Europe", name: "Monaco" },
  ME: { continent: "Europe", name: "Montenegro" },
  NL: { continent: "Europe", name: "Netherlands" },
  MK: { continent: "Europe", name: "North Macedonia" },
  NO: { continent: "Europe", name: "Norway" },
  PL: { continent: "Europe", name: "Poland" },
  PT: { continent: "Europe", name: "Portugal" },
  RO: { continent: "Europe", name: "Romania" },
  RU: { continent: "Europe", name: "Russia" },
  SM: { continent: "Europe", name: "San Marino" },
  RS: { continent: "Europe", name: "Serbia" },
  SK: { continent: "Europe", name: "Slovakia" },
  SI: { continent: "Europe", name: "Slovenia" },
  ES: { continent: "Europe", name: "Spain" },
  SE: { continent: "Europe", name: "Sweden" },
  CH: { continent: "Europe", name: "Switzerland" },
  UA: { continent: "Europe", name: "Ukraine" },
  GB: { continent: "Europe", name: "United Kingdom" },
  VA: { continent: "Europe", name: "Vatican City" },

  // North America
  AG: { continent: "North America", name: "Antigua and Barbuda" },
  BS: { continent: "North America", name: "Bahamas" },
  BB: { continent: "North America", name: "Barbados" },
  BZ: { continent: "North America", name: "Belize" },
  CA: { continent: "North America", name: "Canada" },
  CR: { continent: "North America", name: "Costa Rica" },
  CU: { continent: "North America", name: "Cuba" },
  DM: { continent: "North America", name: "Dominica" },
  DO: { continent: "North America", name: "Dominican Republic" },
  SV: { continent: "North America", name: "El Salvador" },
  GD: { continent: "North America", name: "Grenada" },
  GT: { continent: "North America", name: "Guatemala" },
  HT: { continent: "North America", name: "Haiti" },
  HN: { continent: "North America", name: "Honduras" },
  JM: { continent: "North America", name: "Jamaica" },
  MX: { continent: "North America", name: "Mexico" },
  NI: { continent: "North America", name: "Nicaragua" },
  PA: { continent: "North America", name: "Panama" },
  KN: { continent: "North America", name: "Saint Kitts and Nevis" },
  LC: { continent: "North America", name: "Saint Lucia" },
  VC: { continent: "North America", name: "Saint Vincent and the Grenadines" },
  TT: { continent: "North America", name: "Trinidad and Tobago" },
  US: { continent: "North America", name: "United States" },

  // South America
  AR: { continent: "South America", name: "Argentina" },
  BO: { continent: "South America", name: "Bolivia" },
  BR: { continent: "South America", name: "Brazil" },
  CL: { continent: "South America", name: "Chile" },
  CO: { continent: "South America", name: "Colombia" },
  EC: { continent: "South America", name: "Ecuador" },
  FK: { continent: "South America", name: "Falkland Islands" },
  GF: { continent: "South America", name: "French Guiana" },
  GY: { continent: "South America", name: "Guyana" },
  PY: { continent: "South America", name: "Paraguay" },
  PE: { continent: "South America", name: "Peru" },
  SR: { continent: "South America", name: "Suriname" },
  UY: { continent: "South America", name: "Uruguay" },
  VE: { continent: "South America", name: "Venezuela" },

  // Oceania
  AS: { continent: "Oceania", name: "American Samoa" },
  AU: { continent: "Oceania", name: "Australia" },
  CK: { continent: "Oceania", name: "Cook Islands" },
  FJ: { continent: "Oceania", name: "Fiji" },
  PF: { continent: "Oceania", name: "French Polynesia" },
  GU: { continent: "Oceania", name: "Guam" },
  KI: { continent: "Oceania", name: "Kiribati" },
  MH: { continent: "Oceania", name: "Marshall Islands" },
  FM: { continent: "Oceania", name: "Micronesia" },
  NR: { continent: "Oceania", name: "Nauru" },
  NC: { continent: "Oceania", name: "New Caledonia" },
  NZ: { continent: "Oceania", name: "New Zealand" },
  NU: { continent: "Oceania", name: "Niue" },
  NF: { continent: "Oceania", name: "Norfolk Island" },
  MP: { continent: "Oceania", name: "Northern Mariana Islands" },
  PW: { continent: "Oceania", name: "Palau" },
  PG: { continent: "Oceania", name: "Papua New Guinea" },
  PN: { continent: "Oceania", name: "Pitcairn Islands" },
  WS: { continent: "Oceania", name: "Samoa" },
  SB: { continent: "Oceania", name: "Solomon Islands" },
  TK: { continent: "Oceania", name: "Tokelau" },
  TO: { continent: "Oceania", name: "Tonga" },
  TV: { continent: "Oceania", name: "Tuvalu" },
  VU: { continent: "Oceania", name: "Vanuatu" },
  WF: { continent: "Oceania", name: "Wallis and Futuna" },

  // Antarctica
  AQ: { continent: "Antarctica", name: "Antarctica" },
};

/**
 * Get continent and country name from country code
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code
 * @returns {Object} Object containing continent and country name
 */
export const getGeolocationFromCountryCode = (countryCode) => {
  if (!countryCode) {
    return { continent: "", countryName: "" };
  }

  const upperCode = countryCode.toUpperCase();
  const location = COUNTRY_TO_CONTINENT_MAP[upperCode];

  if (location) {
    return {
      continent: location.continent,
      countryName: location.name,
    };
  }

  return { continent: "", countryName: "" };
};

/**
 * Get geolocation data from localStorage (Cloudflare country) or browser APIs
 * @returns {Object} Object containing country code, country name, and continent
 */
export const getGeolocationData = () => {
  if (typeof window === "undefined") {
    return { countryCode: "", countryName: "", continent: "" };
  }

  try {
    // First try to get from localStorage (saved from Cloudflare)
    const cfCountry = localStorage.getItem("cfCountry");

    if (cfCountry) {
      const { continent, countryName } =
        getGeolocationFromCountryCode(cfCountry);
      return {
        countryCode: cfCountry,
        countryName,
        continent,
      };
    }

    // Fallback: Could implement other geolocation methods here
    // For now, return empty values if no Cloudflare data is available
    return { countryCode: "", countryName: "", continent: "" };
  } catch (error) {
    console.warn("Failed to get geolocation data:", error);
    return { countryCode: "", countryName: "", continent: "" };
  }
};
