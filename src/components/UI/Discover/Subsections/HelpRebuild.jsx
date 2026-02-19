import React from "react";
import Link from "next/link";
import { buildSimpleTypography } from "@/utils/helpers";
import BoxWithImageBackground from "@/components/atoms/BoxWithImageBackground";
import { ASSET_PATHS } from "@/utils/assets";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";

const HelpRebuild = () => {
  return (
    <>
      <BoxWithImageBackground
        sx={{ height: "594px", overflow: "hidden", borderRadius: "32px" }}
        imageUrl={ASSET_PATHS.images.rebuildFamily}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "20%",
            "-webkit-mask-image":
              "linear-gradient(to bottom,transparent 5%,black 80%)",
            // maskImage: 'linear-gradient(to bottom,transparent 5%,black 80%)',
            borderRadius: "32px",
            backdropFilter: "blur(4px)",
            mask: "linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%",
          }}
        >
          &nbsp;
        </div>
        <StackComponent
          sx={{
            position: "absolute",
            bottom: "32px",
            left: "32px",
            right: "32px",
            "@media (max-width:600px)": {
              bottom: "16px",
              left: "16px",
              right: "16px",
            },
          }}
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <StackComponent
            sx={{ width: "100%" }}
            direction="column"
            justifyContent="space-between"
          >
            <TypographyComp
              sx={{
                ...buildSimpleTypography(500, 32, 38),
                color: "#ffffff",
                "@media (max-width:600px)": {
                  ...buildSimpleTypography(500, 18, 22),
                },
              }}
            >
              Help Rebuild a Shattered Gazan Family&apos;s Life
            </TypographyComp>
            <TypographyComp
              sx={{
                ...buildSimpleTypography(500, 18, 22),
                color: "#ffffff",
                "@media (max-width:600px)": {
                  ...buildSimpleTypography(400, 14, 16),
                  maxWidth: "203px",
                },
              }}
            >
              Help AbedalAziz and his family who lost a daughter and suffered
              major injuries as a result attacks on
            </TypographyComp>
          </StackComponent>
          <Link
            prefetch={false}
            href="/emergency-appeal-to-support-worshipers-in-al-aqsa-and-families-in-gaza?src=internal_website"
            style={{ textDecoration: "none" }}
          >
            <ButtonComp
              component="span"
              variant="contained"
              sx={{
                textTransform: "uppercase",
                ...buildSimpleTypography(400, 16, 20),
                height: "46px",
                width: "192px",
                "@media (max-width:600px)": {
                  ...buildSimpleTypography(400, 14, 16),
                  textTransform: "capitalize",
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  width: "128px",
                  px: "0 !important",
                  height: "34px",
                },
              }}
            >
              Donate Now
            </ButtonComp>
          </Link>
        </StackComponent>
      </BoxWithImageBackground>
    </>
  );
};

export default HelpRebuild;
