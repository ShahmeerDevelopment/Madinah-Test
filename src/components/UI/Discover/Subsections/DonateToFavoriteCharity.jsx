"use client";

import { getCharityList } from "@/api";
import React, { useEffect, useState } from "react";
import SectionHeading from "../UI/SectionHeading";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import AlertComponent from "@/components/atoms/AlertComponent";
import ReuseAbleSlider from "@/components/molecules/carousel/ReuseAbleSlider";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { ASSET_PATHS } from "@/utils/assets";
import Image from "@/components/atoms/imageComponent/Image";

const DonateToFavoriteCharity = ({ initialData = [] }) => {
  const mapCharities = (list) => {
    return list.map((eachOrganization) => ({
      id: eachOrganization?._id,
      image: eachOrganization?.imageUrl,
      payload: { ...eachOrganization },
    }));
  };

  const [charities, setCharities] = useState(
    initialData && initialData.length > 0 ? mapCharities(initialData) : []
  );
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    // If we have initial data, we don't need to fetch
    if (initialData && initialData.length > 0) {
      return;
    }

    setLoading(true);
    getCharityList("", 100, 0)
      .then((res) => {
        if (!res?.data?.success) {
          return setError("Error while fetching Charities");
        }
        setError("");
        const list = mapCharities(res?.data?.data?.charityOrganizations || []);
        setCharities(list);
      })
      .catch((err) => {
        console.error(err.message);
        return setError("Error while fetching Charities");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialData]);

  return (
    <>
      <SectionHeading>Donate to your favorite charity</SectionHeading>
      {loading ? (
        <SkeletonComponent width="100%" height="100%" />
      ) : (
        <>
          {error ? (
            <AlertComponent severity="error">{error}</AlertComponent>
          ) : (
            <>
              <ReuseAbleSlider
                isDragAble={false}
                slidesToShowFullView={10}
                slidesToShowAt480px={4}
                totalArrayLength={charities.length}
              >
                {charities.map((item, index) => (
                  <BoxComponent
                    key={index}
                    sx={{
                      width: "80px",
                      height: "58px",
                      minWidth: "80px",
                      maxWidth: "80px",
                      borderRadius: "8px",
                      background: "#F6F6F6",
                      p: "1px",
                    }}
                  >
                    <Image
                      source={item.image || ASSET_PATHS.images.placeholder}
                      width={"100%"}
                      height={"100%"}
                      alt={`organization${index}`}
                    />
                  </BoxComponent>
                ))}
              </ReuseAbleSlider>
            </>
          )}
        </>
      )}
    </>
  );
};

export default DonateToFavoriteCharity;
