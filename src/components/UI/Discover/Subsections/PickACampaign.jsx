import React from "react";
import { createSearchParams } from "@/utils/helpers";
import SectionHeading from "../UI/SectionHeading";
import StackComponent from "@/components/atoms/StackComponent";
import IconText from "../UI/IconText";
import NeedsLove from "../icons/NeedsLove";
import EndingSoon from "../icons/EndingSoon";
import AlmostFunded from "../icons/AlmostFunded";
import GiveZakat from "../icons/GiveZakat";

const PickACampaign = () => {
  return (
    <>
      <SectionHeading>Pick a campaign that...</SectionHeading>
      <StackComponent
        spacing="16px"
        sx={{
          "@media (max-width:700px)": {
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "space-between",
            "& > *": {
              ml: "0 !important",
              flex: "0 0 calc(50% - 8px)",
              maxWidth: "calc(50% - 8px)",
            },
          },
        }}
        justifyContent="center"
        alignItems="center"
      >
        <IconText
          href={createSearchParams(
            { choice: "needs-love", name: "Needs Love" },
            "/category",
          )}
          icon={<NeedsLove />}
          text="Needs Love"
        />
        <IconText
          href={createSearchParams(
            { choice: "ending-soon", name: "Ending Soon" },
            "/category",
          )}
          icon={<EndingSoon />}
          text="Ending Soon"
        />
        <IconText
          href={createSearchParams(
            { choice: "almost-completed", name: "Almost Funded" },
            "/category",
          )}
          icon={<AlmostFunded />}
          text="Almost Funded"
        />
        <IconText
          href={createSearchParams(
            { choice: "zakat", name: "Give Zakat" },
            "/category",
          )}
          icon={<GiveZakat />}
          text="Give Zakat"
        />
      </StackComponent>
    </>
  );
};

export default PickACampaign;
