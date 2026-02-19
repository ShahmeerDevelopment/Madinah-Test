// CDN-optimized: Images served from /public/assets/ folder
const IMAGES = {
  img_1: "/assets/images/organizations/img_1.png",
  img_2: "/assets/images/organizations/img_2.png",
  img_3: "/assets/images/organizations/img_3.png",
  img_4: "/assets/images/organizations/img_4.png",
  img_5: "/assets/images/organizations/img_5.png",
  img_6: "/assets/images/organizations/img_6.png",
  img_7: "/assets/images/organizations/img_7.png",
  img_8: "/assets/images/organizations/img_8.png",
  img_9: "/assets/images/organizations/img_9.png",
  img_10: "/assets/images/organizations/img_10.png",
};

export const organizations_logos_arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
].map((eachNumber) => {
  const moduluIterator = ((eachNumber - 1) % 6) + 1;
  const payloadObject = {
    id: eachNumber,
    image: IMAGES[`img_${moduluIterator}`],
  };

  return payloadObject;
});
