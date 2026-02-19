import React, {
  useRef,
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import Image from "next/image";
import ImageUploading from "react-images-uploading";
import ButtonComp from "../../../atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../atoms/boxComponent/BoxComponent";
import TypographyComp from "../../../atoms/typography/TypographyComp";
import SkeletonComponent from "../../../atoms/SkeletonComponent";
import { theme } from "../../../../config/customTheme";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import StackComponent from "../../../atoms/StackComponent";
import useFileUpload from "react-use-file-upload";
import ListComponent from "../../ListComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatNumberWithEllipsis } from "../../../../utils/helpers";
import LoadingBtn from "../../../advance/LoadingBtn";
import SubHeading from "../../../atoms/createCampaigns/SubHeading";

const secondaryLabelStyles = {
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: "16px",
  width: "273px",
  mb: 3,
};

const GeneralFileUpload = forwardRef(
  (
    {
      list,
      onFileChange = () => {},
      handleFileDeletion = () => {},
      isLoading = false,
      multiple = true,
    },
    ref
  ) => {
    const { setFiles, files, removeFile } = useFileUpload();
    const [initialLoad, setInitialLoad] = useState(false);
    const [isRemoveState, setIsRemoveState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const inputRef = useRef();
    const onFileChangeRef = useRef(onFileChange);

    // Update the ref when onFileChange changes
    useEffect(() => {
      onFileChangeRef.current = onFileChange;
    }, [onFileChange]);

    // Expose the input ref to parent components
    useImperativeHandle(ref, () => inputRef.current, []);

    useEffect(() => {
      if (
        initialLoad &&
        !isRemoveState &&
        typeof onFileChangeRef.current === "function"
      ) {
        onFileChangeRef.current(files);
      }
    }, [files, initialLoad, isRemoveState]); // Removed onFileChange from dependencies
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const handleUpload = (e) => {
      setInitialLoad(true);
      setIsRemoveState(false);
      const files = e.target.files;
      let isValid = true;
      let errMsg = "";
      // Check each file's type
      for (let i = 0; i < files.length; i++) {
        if (!allowedTypes.includes(files[i].type)) {
          isValid = false;
          errMsg = "Only JPG, PNG, and PDF files are allowed.";
          break;
        }
        if (files[i].size > 51 * 1024 * 1024) {
          // Check file size (50MB limit)
          isValid = false;
          errMsg = "File size should not exceed 50MB.";
          break;
        }
      }

      if (isValid) {
        setErrorMessage("");
        setFiles(e, "a");
        if (inputRef.current) {
          inputRef.current.value = null;
        }
      } else {
        setErrorMessage(errMsg);
      }
    };

    const handleRemove = (res, index) => {
      setIsRemoveState(true);
      handleFileDeletion(index);
      removeFile(res.name);
    };
    // useEffect(() => {
    // 	if (list.length > 0) {
    // 		setFiles(list, 'a');
    // 	}
    // }, []);
    return (
      <BoxComponent>
        <StackComponent direction="column" alignItems="center" spacing={2}>
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            style={{ display: "none" }}
            onChange={handleUpload}
            accept=".jpg, .jpeg, .png, .pdf"
          />
          <SubHeading sx={{ color: "#090909" }}>Upload files</SubHeading>
          <TypographyComp
            align="center"
            color={theme.palette.primary.gray}
            sx={secondaryLabelStyles}
          >
            JPG, PNG or PDF. Maximum file size: 50MB
          </TypographyComp>
          <LoadingBtn
            variant="contained"
            onClick={() => inputRef.current?.click()}
            btnProps={{
              size: "medium",
              sx: {
                p: "12px 32px",
              },
            }}
            loadingState={isLoading}
            loadingLabel={"Uploading File"}
          >
            Select Files
          </LoadingBtn>
          {errorMessage !== "" ? (
            <TypographyComp color="error">{errorMessage}</TypographyComp>
          ) : null}
          <StackComponent direction="column" sx={{ width: "100%" }}>
            <ListComponent
              withSecondaryAction
              items={[
                ...list.map((fileObj, index) => {
                  return {
                    id: index,
                    name: fileObj.name,
                    label: formatNumberWithEllipsis(fileObj.name, 20),
                    secondaryActionIcon: <DeleteIcon />,
                    deleteAction: (res) => handleRemove(res, index),
                    otherItemData: fileObj,
                  };
                }),
              ]}
            />
            {isLoading ? (
              <StackComponent sx={{ width: "100%" }} direction="column">
                <SkeletonComponent
                  sx={{
                    borderRadius: "10px",
                    width: "100%",
                  }}
                />
              </StackComponent>
            ) : null}
          </StackComponent>
        </StackComponent>
      </BoxComponent>
    );
  }
);

GeneralFileUpload.displayName = "GeneralFileUpload";

const UploadFile = forwardRef(
  (
    {
      images,
      onUpload,
      isLoading = false,
      onlyImages = true,
      handleFileDeletion = () => {},
      multiple = true,
    },
    ref
  ) => {
    const maxNumber = 69;

    const changeHandler = (imageList, addUpdateIndex) => {
      onUpload(imageList, addUpdateIndex);
    };

    return (
      <div>
        {onlyImages ? (
          <ImageUploading
            multiple={false}
            value={images}
            onChange={changeHandler}
            maxNumber={maxNumber}
            dataURLKey="data_url"
            acceptType={["jpg", "png", "jpeg", "pdf"]}
          >
            {({ onImageUpload, dragProps, errors }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <BoxComponent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  {...dragProps}
                >
                  <BoxComponent
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "space-between", sm: "flex-start" },
                      alignItems: "flex-start",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <SubHeading sx={{ color: "#090909" }}>
                      Upload files
                    </SubHeading>
                  </BoxComponent>
                  <TypographyComp
                    align="center"
                    color={theme.palette.primary.gray}
                    sx={secondaryLabelStyles}
                  >
                    JPG, PNG or PDF. Maximum file size: 50MB
                  </TypographyComp>
                  <ButtonComp
                    variant="contained"
                    onClick={onImageUpload}
                    size="medium"
                    component="span"
                    disabled={isLoading ? true : false}
                  >
                    Select files
                  </ButtonComp>
                </BoxComponent>
                {errors && (
                  <div style={{ color: "red" }}>
                    {errors.maxNumber && (
                      <TypographyComp>
                        Number of selected images exceed maxNumber
                      </TypographyComp>
                    )}
                    {errors.acceptType && (
                      <TypographyComp>
                        Your selected file type is not allowed!
                      </TypographyComp>
                    )}
                    {errors.maxFileSize && (
                      <TypographyComp>
                        Selected file size exceed maxFileSize
                      </TypographyComp>
                    )}
                  </div>
                )}
                <BoxComponent
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    my: 2,
                  }}
                >
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    images.map((image, index) => (
                      <div key={index} className="image-item">
                        <Image
                          src={image}
                          alt=""
                          height={150}
                          width={200}
                          style={{
                            borderRadius: "12px",
                            width: "auto",
                            height: "150px",
                          }}
                        />
                      </div>
                    ))
                  )}
                </BoxComponent>
              </div>
            )}
          </ImageUploading>
        ) : (
          <GeneralFileUpload
            ref={ref}
            handleFileDeletion={handleFileDeletion}
            isLoading={isLoading}
            onFileChange={(e) => onUpload(e, null, true)}
            list={images}
            multiple={multiple}
          />
        )}
      </div>
    );
  }
);

UploadFile.displayName = "UploadFile";

UploadFile.propTypes = {
  handleFileDeletion: PropTypes.func,
  images: PropTypes.array, // setImages: PropTypes.func,
  isLoading: PropTypes.bool,
  onUpload: PropTypes.func,
  onlyImages: PropTypes.bool,
};
GeneralFileUpload.propTypes = {
  handleFileDeletion: PropTypes.func,
  isLoading: PropTypes.bool,
  list: PropTypes.array,
  onFileChange: PropTypes.func,
};

export default UploadFile;
