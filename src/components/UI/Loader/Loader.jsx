"use client";

import React from "react";
import { Main, Wrapper } from "./loader.style";
import { ASSET_PATHS } from "@/utils/assets";
import LinearLoader from "@/components/atoms/ProgressBarComponent/LinearLoader";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import Portal from "@mui/material/Portal";
import StackComponent from "@/components/atoms/StackComponent";
import Image from "next/image";

const Loader = () => {
  return (
    <Main>
      <Portal container={() => document.getElementById("root")}>
        <Wrapper>
          <StackComponent
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image src={ASSET_PATHS.images.logo} height={40} width={130} alt="logo" />
            <BoxComponent sx={{ width: "180px", mt: "30px" }}>
              <LinearLoader />
            </BoxComponent>
          </StackComponent>
        </Wrapper>
      </Portal>
    </Main>
  );
};

export default Loader;
