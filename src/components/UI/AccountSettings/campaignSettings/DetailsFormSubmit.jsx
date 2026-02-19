import PropTypes from "prop-types";
import React from "react";
import StackComponent from "../../../../components/atoms/StackComponent";
import { useSelector } from "react-redux";
import { updateUserPixelData } from "../../../../api/update-api-service";
import toast from "react-hot-toast";

const DetailsFormSubmit = ({
  setLoading,
  children,
  setIsSubmittedAttempted,
}) => {
  const allValues = useSelector((state) => state.mutateAuth);
  const handleSubmit = () => {
    const payload = {
      pixelId: allValues?.pixelId,
      pixelAccessToken: allValues?.pixelAccessToken,
      gtmId: allValues?.gtmId,
    };

    updateUserPixelData(payload)
      .then((res) => {
        const result = res?.data;
        if (result.success) {
          toast.success("Pixel Updated Successfully");
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const dispatch = useDispatch();
  return (
    <StackComponent
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        handleSubmit();
        setIsSubmittedAttempted(true);
      }}
      direction="column"
      spacing="16px"
    >
      {children}
    </StackComponent>
  );
};

DetailsFormSubmit.propTypes = {
  children: PropTypes.any,
  setIsSubmittedAttempted: PropTypes.func,
  setLoading: PropTypes.func,
};

export default DetailsFormSubmit;
