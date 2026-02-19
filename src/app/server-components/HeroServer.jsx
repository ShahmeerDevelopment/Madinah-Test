/**
 * Server Component - Static Hero section
 * Pre-rendered on the server for better LCP and SEO
 * Uses next/image and next/link for optimized loading
 */

import Image from "next/image";
import Link from "next/link";

const backgroundPoster = "/assets/images/background_poster.png";
const backgroundPosterMobile = "/assets/images/background_poster_mobile.webp";
const rainVideo = "/assets/videos/sky.mp4";

// Static styles (no emotion/styled-components needed for server component)
const heroSectionStyles = {
  height: "800px",
  marginTop: "-72px",
  marginBottom: "24px",
  position: "relative",
  paddingRight: "0px !important",
  paddingLeft: "0px !important",
};

const heroWrapperStyles = {
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: "0px 0px 40px 40px",
  backgroundPositionY: "75.5%",
  backgroundRepeat: "no-repeat",
  overflow: "hidden",
};

const videoStyles = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  minWidth: "100%",
  position: "absolute",
  pointerEvents: "none",
  zIndex: 1,
};

const imageContainerStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
};

const contentBoxStyles = {
  position: "absolute",
  width: "483px",
  top: "231px",
  left: "270px",
  color: "#090909",
  zIndex: 2,
};

const buttonStyles = {
  padding: "12px 32px",
  borderRadius: "48px",
  height: "46px",
  minWidth: "170px",
  width: "auto",
  color: "#FFFFFF",
  fontWeight: 400,
  fontSize: "15px",
  lineHeight: "20px",
  backgroundColor: "#6363E6",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center",
};

const HeroServer = () => {
  return (
    <div className="hero-parallax-container">
      <section style={heroSectionStyles} className="hero-section">
        <style>{`
          /* CSS-only parallax effect with smooth easing */
          .hero-parallax-container {
            /* Create a scroll timeline for the parallax effect */
            animation: hero-parallax ease-out;
            animation-timeline: scroll(root);
            animation-range: 0 800px;
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          
          @keyframes hero-parallax {
            0% {
              transform: translateY(0px) translateZ(0);
            }
            50% {
              transform: translateY(70px) translateZ(0);
            }
            75% {
              transform: translateY(95px) translateZ(0);
            }
            90% {
              transform: translateY(105px) translateZ(0);
            }
            100% {
              transform: translateY(110px) translateZ(0);
            }
          }
          
          /* Fallback for browsers that don't support scroll-driven animations */
          @supports not (animation-timeline: scroll()) {
            .hero-parallax-container {
              /* No parallax effect in unsupported browsers */
              animation: none;
            }
          }
        `}</style>
        <style>{`
        .hero-section {
          height: 800px;
          margin-top: -72px;
          margin-bottom: 24px;
          padding-right: 0px !important;
          padding-left: 0px !important;
        }
        .hero-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 0px 0px 40px 40px;
          background-position-y: 75.5%;
          background-repeat: no-repeat;
          overflow: hidden;
        }
        .hero-video {
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          min-width: 100%;
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }
        .hero-content-box {
          position: absolute;
          width: 483px;
          top: 231px;
          left: 270px;
          color: #090909;
          z-index: 2;
        }
        .hero-title {
          font-weight: 600;
          font-size: 48px;
          line-height: 54px;
          letter-spacing: -0.408px;
          margin: 0;
          color: #090909;
          font-family: var(--font-league-spartan), Arial, sans-serif;
        }
        .hero-subtitle {
          margin-top: 12px;
          margin-bottom: 24px;
          font-size: 22px;
          line-height: 28px;
          letter-spacing: -0.408px;
          color: #090909;
          font-weight: 500;
          font-family: var(--font-league-spartan), Arial, sans-serif;
        }
        .hero-button {
          padding: 12px 32px;
          border-radius: 48px;
          height: 46px;
          min-width: 170px;
          width: auto;
          color: #FFFFFF;
          font-weight: 400;
          font-size: 15px;
          line-height: 20px;
          background-color: #6363E6;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .hero-button:hover {
          background-color: #5252D1;
        }
        @media (max-width: 1400px) {
          .hero-video {
            height: 100%;
          }
        }
        @media (max-width: 1000px) {
          .hero-video {
            margin-left: -12rem;
            display: none;
          }
        }
        @media (max-width: 900px) {
          .hero-section {
            height: 612px;
          }
          .hero-wrapper {
            border-radius: 0px 0px 40px 40px;
          }
          .hero-content-box {
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            text-align: center;
          }
        }
        @media (max-width: 600px) {
          .hero-section {
            height: 612px;
          }
          .hero-wrapper {
            border-radius: 0px;
          }
          .hero-video {
            margin-left: -20rem;
          }
          .hero-content-box {
            top: 210px;
            left: 10px;
            transform: translateX(0%) translateY(0%);
            max-width: 95%;
            width: 366px;
            text-align: left;
          }
          .hero-title {
            font-weight: 500;
            font-size: 32px;
            line-height: 37px;
            letter-spacing: -0.71px;
            max-width: 75%;
          }
          .hero-subtitle {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            max-width: 75%;
          }
        }
      `}</style>
        <div className="hero-wrapper">
          {/* 
            LCP Optimization: Use picture element for responsive images
            - Mobile (<=640px): Serve 22KB WebP instead of 560KB PNG
            - Desktop: Use Next.js Image optimization
          */}
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet={backgroundPosterMobile}
              type="image/webp"
            />
            <Image
              src={backgroundPoster}
              alt="Madinah fundraising hero background"
              fill
              priority={true}
              fetchPriority="high"
              sizes="(max-width: 640px) 640px, 100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                zIndex: 0,
              }}
            />
          </picture>

          {/* Video - loads after initial paint, preload=none to prioritize LCP image */}
          <video
            className="hero-video"
            src={rainVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            style={{
              zIndex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              minWidth: "100%",
              pointerEvents: "none",
            }}
          >
            Your browser does not support HTML5 video.
          </video>

          <div className="hero-content-box">
            <h1 className="hero-title">
              Trusted fundraising for all of life&apos;s moments
            </h1>
            <p className="hero-subtitle">
              Get help. Give kindness. Start in just 5 minutes.
            </p>
            {/* Next.js Link for client-side navigation */}
            <Link
              href="/create-campaign"
              className="hero-button"
              prefetch={false}
            >
              Start fundraising
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroServer;
