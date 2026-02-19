// import { Suspense } from "react";
// import { cookies } from "next/headers";
// import StaticCampaignShell from "./StaticCampaignShell.server";
// import DynamicCampaignContent from "./DynamicCampaignContent.server";
// import { getAllActiveCampaignSlugs } from "./static-campaign.server";
// import {
//   RightSideSkeleton,
//   MobileDonationBarSkeleton,
//   LeftSideSkeleton,
// } from "./components/CampaignSkeletons";
// import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
// import StackComponent from "@/components/atoms/StackComponent";

// export async function generateStaticParams() {
//   const slugs = await getAllActiveCampaignSlugs();
//   return slugs;
// }

// const containerStyles = {
//   maxWidth: "1120px",
//   width: "100%",
//   margin: { xs: "0 auto", md: "24px auto" },
//   padding: { xs: "16px", md: "0" },
//   minHeight: "calc(100vh - 272px)",
//   // Prevent layout shift by accounting for scrollbar
//   marginLeft: "auto",
//   marginRight: "auto",
//   // Prevent flexbox from causing layout shifts when content loads
//   alignItems: "flex-start",
//   // Force GPU acceleration for smoother rendering
//   willChange: "auto",
// };

// /**
//  * Fallback for dynamic content (right side + mobile bar)
//  */
// function DynamicContentFallback() {
//   return (
//     <>
//       {/* Right side skeleton - desktop only */}
//       <BoxComponent
//         sx={{
//           display: { xs: "none", md: "block" },
//           width: "31.508%",
//           flexShrink: 0,
//           position: { xs: "relative", md: "sticky" },
//           top: { xs: "auto", md: "88px" },
//           alignSelf: "flex-start",
//           height: "fit-content",
//         }}
//       >
//         <RightSideSkeleton />
//       </BoxComponent>
//       {/* Mobile bar skeleton */}
//       <MobileDonationBarSkeleton />
//     </>
//   );
// }

// /**
//  * DynamicContentWrapper - Accesses cookies and renders dynamic content only
//  * This component is wrapped in Suspense to handle dynamic data access
//  */
// async function DynamicContentWrapper({ params, searchParams }) {
//   // Get authentication token from cookies (inside Suspense boundary)
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   return (
//     <DynamicCampaignContent
//       params={params}
//       searchParams={searchParams}
//       token={token}
//     />
//   );
// }

export default function Page({ params, searchParams }) {
  return (

    <></>

    // <StackComponent
    //   direction={{ xs: "column", md: "row" }}
    //   spacing="24px"
    //   justifyContent="flex-start"
    //   sx={{
    //     ...containerStyles,
    //     // Ensure gap is applied immediately to prevent layout shift
    //     gap: { xs: "16px", md: "24px" },
    //   }}
    // >
    //   {/* STATIC SHELL - Renders immediately in initial paint (no token needed) */}
    //   <StaticCampaignShell params={params} />

    //   {/* DYNAMIC CONTENT - Streams in with authentication */}
    //   <Suspense fallback={<DynamicContentFallback />}>
    //     <DynamicContentWrapper params={params} searchParams={searchParams} />
    //   </Suspense>
    // </StackComponent>
  );
}
