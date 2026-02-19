// CDN-optimized: Images served from /public/assets/ folder
const DATA = {
  country_1: {
    img: "/assets/images/countries/country_1.png",
    name: "Morocco",
  },
  country_2: {
    img: "/assets/images/countries/country_2.png",
    name: "Palestine",
  },
  country_3: {
    img: "/assets/images/countries/country_3.png",
    name: "Senegal",
  },
};

export const countries_data = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
].map((eachNumber) => {
  const moduluIterator = ((eachNumber - 1) % Object.keys(DATA).length) + 1;
  const CURRENT_COUNTRY = DATA[`country_${moduluIterator}`];
  const payloadObject = {
    id: eachNumber,
    countryName: CURRENT_COUNTRY?.name,
    image: CURRENT_COUNTRY?.img,
  };

  return payloadObject;
});
