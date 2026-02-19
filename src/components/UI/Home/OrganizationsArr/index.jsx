"use client";

import React, { useEffect, useState } from "react";

import { ASSET_PATHS } from "@/utils/assets";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import AlertComponent from "@/components/atoms/AlertComponent";
import LazyReuseAbleSlider from "@/components/molecules/carousel/LazyReuseAbleSlider";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { getCharityList } from "@/api";
import Image from "@/components/atoms/imageComponent/Image";

const OrganizationsArr = ({ serverOrganizations = [] }) => {
  // Use server data if available, otherwise fetch client-side
  const [loading, setLoading] = useState(serverOrganizations.length === 0);
  const [error, setError] = useState("");
  const [charityOrganizationsList, setCharityOrganizationsList] =
    useState(serverOrganizations);

  useEffect(() => {
    // Skip client fetch if we have server data
    if (serverOrganizations.length > 0) {
      setCharityOrganizationsList(serverOrganizations);
      setLoading(false);
      return;
    }

    // Fallback: fetch client-side only if no server data
    setLoading(true);
    getCharityList("", 100)
      .then((res) => {
        setError("");
        const organizations = res?.data?.data?.charityOrganizations;
        const arr = [
          ...organizations.map((eachOrg) => ({
            id: eachOrg._id,
            image: eachOrg.imageUrl,
            payload: {
              ...eachOrg,
            },
          })),
        ];
        setCharityOrganizationsList(arr);
      })
      .catch((err) => {
        console.log("error", err);
        return setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serverOrganizations]);
  return (
    <>
      {loading ? (
        <SkeletonComponent width="100%" height="100%" />
      ) : (
        <>
          {error ? (
            <AlertComponent severity="error">
              Error Occurred while Fetching Organizations
              {console.error(error)}
            </AlertComponent>
          ) : (
            <>
              <LazyReuseAbleSlider
                slidesToShowFullView={9}
                totalArrayLength={charityOrganizationsList.length}
                isOrganization
                slidesToShowAt480px={4}
                isDragAble={false}
              >
                {charityOrganizationsList.map((item, index) => (
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
                      sizes="80px"
                      alt=""
                    />
                  </BoxComponent>
                ))}
              </LazyReuseAbleSlider>
            </>
          )}
        </>
      )}
    </>
  );
};

export default OrganizationsArr;
