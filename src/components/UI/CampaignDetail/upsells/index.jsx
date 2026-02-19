import React, { useState } from "react";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import UpsellsCards from "./upsellCards";
import UpSellAndDownSellForm from "./upsellAndDownSellForm";

const Upsells = React.memo(() => {
  const { isSmallScreen } = useResponsiveScreen();
  const [showUpSellForm, setShowUpSellForm] = useState(false);

  const addUpsellsButtonHandler = () => {
    setShowUpSellForm((previous) => !previous);
  };
  return (
    <>
      <UpsellsCards />
      {showUpSellForm && <UpSellAndDownSellForm />}
      <BoxComponent sx={{ padding: { xs: "16px", sm: "0px 32px" }, my: 2.5 }}>
        <ButtonComp
          size={"normal"}
          fullWidth={isSmallScreen}
          onClick={addUpsellsButtonHandler}
        >
          {showUpSellForm ? "Hide Upsells" : "Add Upsells"}
        </ButtonComp>
      </BoxComponent>
    </>
  );
});

Upsells.displayName = "Upsells";
export default Upsells;
