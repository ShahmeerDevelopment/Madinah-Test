/* eslint-disable no-unused-vars */
"use client";

import React, { useEffect, useRef } from "react";
import { HeroSection, HeroWrapper, Video } from "./Hero.style";
import { buildSimpleTypography } from "@/utils/helpers";
import { ASSET_PATHS } from "@/utils/assets";
const rainGif = ASSET_PATHS.videos.skyGif;
const rainVideo = ASSET_PATHS.videos.skyMp4;
import styled from "@emotion/styled";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
const backgroundPoster = "/assets/images/background_poster.png";
import Parallax from "@/components/atoms/ParallaxComponent";
// import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { resetCampaignValues } from "@/store/slices/campaignSlice";
import { useDispatch } from "react-redux";

const cloudVideo = false;

const showVideo = true;

const BackgroundGif = styled("img")(() => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  minWidth: "100%",
  position: "absolute",
  "@media (max-width:1400px)": {
    height: "100%",
  },
  "@media (max-width:1000px)": {
    marginLeft: "-12rem",
  },
  "@media (max-width:600px)": {
    marginLeft: "-20rem",
  },
}));

const Hero = () => {
  // const router = useRouter();

  const videoRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const handlePlay = () => {
      if (
        videoRef?.current &&
        !videoRef?.current?.paused &&
        !videoRef?.current?.ended
      ) {
        // Video is already playing
      } else {
        videoRef?.current?.play();
      }
    };

    const container = document?.getElementById("video-container");
    container?.addEventListener("click", handlePlay);
    container?.addEventListener("touchstart", handlePlay);

    return () => {
      container?.removeEventListener("click", handlePlay);
      container?.removeEventListener("touchstart", handlePlay);
    };
  }, []);

  return (
    <Parallax strength={"300"}>
      <HeroSection>
        <HeroWrapper id="video-container">
          {/* Priority Image for LCP optimization - hidden when video is playing */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}
          >
            <Image
              src={backgroundPoster}
              alt="Madinah fundraising hero background"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>

          {showVideo ? (
            <Video
              className="inlinevideo"
              ref={videoRef}
              src={rainVideo}
              autoPlay={true}
              muted={true}
              loop={true}
              controls={false}
              playsInline={true}
              preload="none"
              id="myVideo"
              type="video/mp4"
              style={{ zIndex: 1, position: "relative" }}
            >
              Your browser does not support HTML5 video.
            </Video>
          ) : (
            <BackgroundGif
              src={rainGif}
              // autoPlay={true}
              // muted={true}
              // controls={false}
              // loop={true}
              // playsInline={true}
              id="myVideo"
              // type="video/mp4"
            />
          )}

          <BoxComponent
            sx={{
              position: "absolute",
              // background: 'pink',
              width: { xs: "366px", sm: "483px" },
              top: 231,
              left: 270,
              color: "#090909",
              zIndex: 2,
              "@media (max-width:900px)": {
                top: "50%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)",
              },
              "@media (max-width:600px)": {
                top: "210px",
                left: "10px",
                transform: "translateX(0%) translateY(0%)",
                maxWidth: "95%",
              },
            }}
          >
            <BoxComponent
              sx={{
                zIndex: 2,
                "@media (max-width:900px)": {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  "& *": {
                    textAlign: "center",
                  },
                },
                "@media (max-width:600px)": {
                  alignItems: "flex-start",
                  "& *": {
                    textAlign: "left",
                  },
                },
              }}
            >
              <BoxComponent
                sx={{
                  "@media (max-width:600px)": {
                    maxWidth: "75%",
                  },
                }}
              >
                <TypographyComp
                  sx={{
                    fontWeight: 600,
                    fontSize: "48px",
                    lineHeight: "54px",
                    letterSpacing: "-0.408px",
                    "@media (max-width:600px)": {
                      ...buildSimpleTypography(500, 32, 37),
                      letterSpacing: "-0.71px",
                    },
                  }}
                >
                  Trusted fundraising for all of life&apos;s moments
                </TypographyComp>
                <SubHeading
                  sx={{
                    mt: 1.5,
                    mb: 3,
                    color: "#090909",
                    letterSpacing: "-0.408px",
                    "@media (max-width:600px)": {
                      ...buildSimpleTypography(400, 16, 20),
                      // background: 'rgba(255,255,255,0.1)',
                      // backdropFilter: 'blur(3px)',
                    },
                  }}
                >
                  Get help. Give kindness. Start in just 5 minutes.
                </SubHeading>
              </BoxComponent>
              <Link href="/create-campaign" passHref prefetch={false}>
                <ButtonComp
                  sx={{
                    padding: "12px 32px",
                    radius: "48px",
                    height: "46px",
                    minWidth: "170px",
                    width: "auto",
                    color: "#FFFFFF",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "20px",
                  }}
                  onClick={() => dispatch(resetCampaignValues())}
                >
                  Start fundraising
                </ButtonComp>
              </Link>
            </BoxComponent>
          </BoxComponent>
        </HeroWrapper>
      </HeroSection>
    </Parallax>
  );
};

export default Hero;
