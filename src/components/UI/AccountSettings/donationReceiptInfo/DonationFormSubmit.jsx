import PropTypes from "prop-types";
import React from "react";
import StackComponent from "../../../../components/atoms/StackComponent";

const DonationFormSubmit = ({ children }) => {
  // const dispatch = useDispatch();
  return (
    <StackComponent
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
      direction="column"
      spacing="16px"
    >
      {children}
    </StackComponent>
  );
};

DonationFormSubmit.propTypes = {
  children: PropTypes.any,
};

export default DonationFormSubmit;
