"use client";

import React, { useEffect } from "react";
import { scrollToTop } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import StackComponent from "@/components/atoms/StackComponent";
import Section from "./UI/Section";
import HowMadinahWorks from "./HowMadinahWorks";
import TrustedByThose from "./TrustedByThose";
import TemplateSectionFromHome from "./../Home/UI/Section";
import OrganizationsArr from "../Home/OrganizationsArr";
import Testimonials from "./Testimonials";
import StartRecievingFunds from "./StartRecievingFunds";
import { getAllVisits } from "@/api/get-api-services";
import { useSelector } from "react-redux";

const HowItWorks = () => {
  const router = useRouter();
  const utmParameters = useSelector((state) => state.utmParameters);
  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral
    );
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      scrollToTop();
    }
  }, [router]);

  return (
    <StackComponent
      sx={{ width: "100%", mt: "25px" }}
      direction="column"
      spacing={2}
    >
      <Section
        withAction={false}
        heading="How Madinah Works"
        subHeading="Madinah provides the optimal backdrop for your fundraising endeavors, whether you are an individual, group or organization"
      >
        <HowMadinahWorks />
      </Section>
      <Section
        spacing="24px"
        withAction={false}
        heading="Trusted by those you trust"
      >
        <TrustedByThose />
      </Section>
      <TemplateSectionFromHome
        heading="Organizations we work with"
        direction="column"
        spacing="24px"
      >
        <OrganizationsArr />
      </TemplateSectionFromHome>
      <Section
        withAction={false}
        heading="What our users are saying"
        spacing="24px"
      >
        <Testimonials />
      </Section>
      <Section
        centered
        withAction={false}
        spacing="4px"
        heading="Start receiving funds"
      >
        <StartRecievingFunds />
      </Section>
    </StackComponent>
  );
};

export default HowItWorks;
