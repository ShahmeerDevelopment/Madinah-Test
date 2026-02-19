"use client";

import React, { useEffect, useState, useRef } from "react";
import BankDetailLayout from "@/Layouts/BankDetailLayout";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { useSelector, useDispatch } from "react-redux";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@/assets/iconComponent/DeleteIcon";
import UploadIcon from "@/assets/iconComponent/UploadIcon";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { getDocumentTypes, getProfile } from "@/api/get-api-services";
import {
  handleVerificationDocumentApproval,
  uploadVerificationDocument,
} from "@/api/post-api-services";
import toast from "react-hot-toast";
import { addUserDetails } from "@/store/slices/authSlice";
import { deleteVerificationDocument } from "@/api/delete-api-services";
import { updateAuthValues } from "@/store/slices/mutateAuthSlice";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import DeleteModals from "@/components/molecules/deleteModals/DeleteModals";
import {
  CardButtonWrapper,
  CardIconButtonWrapper,
} from "@/styles/CampaignDetails.style";
import EmptyTable from "@/components/molecules/table/EmptyTable";
import {
  Table,
  TableCell,
  TableHeadRow,
  TableHRow,
} from "@/components/molecules/table/Table.style";
import useUploadFileService from "@/hooks/useUploadFileService";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import { campaignStepperIncrementHandler } from "@/store/slices/campaignSlice";
// import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const AddDocumentsUI = ({ createCampaign = false }) => {
  const dummyDocumentData = useSelector(
    (state) => state.auth.userDetails?.verificationDocuments,
  );
  const campaign = useSelector((state) => state?.campaign?.campaignValues);
  const [documentType, setDocumentType] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoadingDocumentTypes, setIsLoadingDocumentTypes] = useState(true);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  // const { isSmallScreen } = useResponsiveScreen();
  const headers = [
    { label: "Document Type", key: "documentType" },
    { label: "Status", key: "status" },
    { label: "Date Uploaded", key: "createdAt" },
    { label: "Actions", key: "actions" },
  ];

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    setIsLoadingDocumentTypes(true);
    try {
      const res = await getDocumentTypes();
      const types = res.data.data.documentTypes.map((type) => ({
        _id: type._id,
        name: type.title, // Using name instead of title
      }));
      setDocumentTypes(types);
    } catch (error) {
      console.error("Error fetching document types:", error);
      toast.error("Failed to load document types. Please try again later.");
    } finally {
      setIsLoadingDocumentTypes(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await deleteVerificationDocument(deleteId);
    if (res?.data?.success) {
      fetchAndSetUserProfile();
      toast.success("Document deleted successfully.");
    } else {
      toast.error("Failed to delete document. Please try again later.");
    }
    setIsLoading(false);
    setOpenDeleteModal(false);
  };

  const fetchAndSetUserProfile = async () => {
    try {
      const res = await getProfile();
      const profileDetails = res?.data?.data;
      if (profileDetails) {
        dispatch(addUserDetails(profileDetails));
        dispatch(updateAuthValues(profileDetails));
        if (res?.data?.success) {
          if (!createCampaign) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getDocumentForType = (typeId) => {
    return (
      dummyDocumentData?.find((doc) => doc.documentTypeId === typeId) || null
    );
  };

  const handleFileSelect = (docType) => {
    setDocumentType(docType);
    fileInputRef.current?.click();
  };

  const { uploadFileService } = useUploadFileService();
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if document type is selected
    if (!documentType) {
      toast.error("Please select document type before uploading files");
      return;
    }

    // Show loading toast notification
    const loadingToast = toast.loading(
      "Please wait while your file is being uploaded. Do not close or refresh the page",
    );

    try {
      const uploadPromises = files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const readerForUpload = new FileReader();
          readerForUpload.onloadend = async () => {
            try {
              const lastDotIndex = file.name.lastIndexOf(".");
              const fileExtension = file.name.substring(lastDotIndex + 1);

              const { success, imageUrl } = await uploadFileService(
                "verification-document-image",
                fileExtension,
                readerForUpload.result,
              );

              if (success && imageUrl) {
                resolve({ url: imageUrl, file });
              } else {
                reject(new Error("Failed to upload file"));
              }
            } catch (error) {
              reject(error);
            }
          };
          readerForUpload.onerror = () =>
            reject(new Error("Error reading file"));
          readerForUpload.readAsArrayBuffer(file);
        });
      });
      const uploadedFiles = await Promise.all(uploadPromises);

      // Dismiss loading toast on success
      toast.dismiss(loadingToast);

      // Create payload directly instead of relying on state updates
      const payload = {
        documentTypeId: documentType._id,
        documentURLs: uploadedFiles.map((imageData) => imageData.url),
      };

      // Upload document directly
      const res = await uploadVerificationDocument(payload);

      if (res?.data?.success) {
        await fetchAndSetUserProfile();
        toast.success("Documents uploaded successfully.");

        // Reset form
        setDocumentType(null);
        // No need to set imagesData since we're not using it anymore
        if (!createCampaign) {
          window.location.reload();
        }
      } else {
        toast.error("Failed to upload documents. Please try again later.");
      }
    } catch (error) {
      console.error("Error processing files:", error);

      // Dismiss loading toast and show error toast
      toast.dismiss(loadingToast);
      toast.error("Error uploading files. Please try again.");
    }
    event.target.value = "";
  };
  // Removed useEffect hook that was causing handleUploadFile to be called twice

  const getStatus = (status) => {
    if (status === "pending") return "Pending Approval";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "";
  };

  const handleSubmitForApproval = async () => {
    setIsLoadingSubmit(true);
    if (createCampaign) {
      dispatch(campaignStepperIncrementHandler(1));
    } else {
      try {
        const res = await handleVerificationDocumentApproval();
        if (res?.data?.success) {
          toast.success("Documents submitted for approval successfully.");
          // If successful, fetch user profile to update the submitted status
          await fetchAndSetUserProfile();
          if (createCampaign) {
            dispatch(campaignStepperIncrementHandler(1));
          }
        } else {
          toast.error(
            res?.data?.message || "Failed to submit documents for approval.",
          );
        }
      } catch (error) {
        console.error("Error submitting documents for approval:", error);
        toast.error(
          "An error occurred while submitting documents for approval.",
        );
      } finally {
        setIsLoadingSubmit(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const userDetails = useSelector((state) => state.auth.userDetails);
  const hasUploadedDocuments =
    dummyDocumentData && dummyDocumentData.length > 0;

  // Check if documents have already been submitted or updated since last submission
  const isAlreadySubmitted = userDetails?.verificationDocumentsSubmittedAt;
  const hasUpdatedSinceSubmission =
    userDetails?.verificationDocumentsSubmittedAt &&
    userDetails?.verificationDocumentsUpdatedAt &&
    new Date(userDetails.verificationDocumentsUpdatedAt) <=
      new Date(userDetails.verificationDocumentsSubmittedAt);

  // For create campaign mode: Check if required documents are uploaded
  const hasRequiredDocumentsForCampaign = () => {
    if (!createCampaign) return true; // Skip this check if not in campaign mode

    // Find document types by exact name match
    const idType = documentTypes.find(
      (type) =>
        type.name === "Residence Permit/National ID/Driver's License/Passport",
    );
    const bankStatementType = documentTypes.find(
      (type) => type.name === "Bank Statement",
    );
    const incorporationDocumentType = documentTypes.find(
      (type) => type.name === "Incorporation Document",
    );

    // Check if at least one of: Passport, Driver's License, or ID is uploaded
    const hasRequiredIdDocument = dummyDocumentData?.some(
      (doc) => doc.documentTypeId === idType?._id,
    );

    if (campaign?.charityOrganizationId) {
      // For charity campaigns: Passport OR Driver's License OR ID, Bank Statement, and Incorporation Document
      // Check if Bank Statement is uploaded
      const hasBankStatement = dummyDocumentData?.some(
        (doc) => doc.documentTypeId === bankStatementType?._id,
      );

      // Check if Incorporation Document is uploaded
      const hasIncorporationDocument = dummyDocumentData?.some(
        (doc) => doc.documentTypeId === incorporationDocumentType?._id,
      );

      return (
        hasRequiredIdDocument && hasBankStatement && hasIncorporationDocument
      );
    }

    // For non-charity campaigns: Passport OR Driver's License OR ID, Bank Statement, and Residence Permit
    // Check if Bank Statement is uploaded
    const hasBankStatement = dummyDocumentData?.some(
      (doc) => doc.documentTypeId === bankStatementType?._id,
    );

    return hasRequiredIdDocument && hasBankStatement;
  };

  // Button should be disabled if no documents uploaded OR already submitted without updates OR while submission is in progress
  // For create campaign: also check if required documents (ID + Bank Statement) are uploaded
  const isSubmitButtonDisabled = createCampaign
    ? !hasRequiredDocumentsForCampaign() || isLoadingSubmit
    : !hasUploadedDocuments ||
      (isAlreadySubmitted && hasUpdatedSinceSubmission) ||
      isLoadingSubmit;

  // Helper function to check if a document is required
  const isDocumentRequired = (docTypeName) => {
    if (!createCampaign) return false; // Don't show asterisks if not in campaign mode

    if (campaign?.charityOrganizationId) {
      // For charity campaigns: Passport OR Driver's License OR ID (at least one), Bank Statement, and Incorporation Document
      return [
        "Residence Permit/National ID/Driver's License/Passport",
        "Bank Statement",
        "Incorporation Document",
      ].includes(docTypeName);
    } else {
      // For non-charity campaigns: Passport OR Driver's License OR ID (at least one), Bank Statement, and Residence Permit
      return [
        "Residence Permit/National ID/Driver's License/Passport",
        "Bank Statement",
      ].includes(docTypeName);
    }
  };

  // Skeleton loaders for document types table
  const renderDocumentTypesSkeleton = () => (
    <tr>
      <td colSpan={4} style={{ padding: "16px 8px" }}>
        <Stack spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <SkeletonComponent
              key={item}
              variant="rounded"
              height="60px"
              sx={{ borderRadius: "8px" }}
            />
          ))}
        </Stack>
      </td>
    </tr>
  );

  const getContinueText = () => {
    if (createCampaign) {
      return "Continue";
    }
    if (isLoadingSubmit) {
      return "Submitting...";
    }
    return "Submit for Approval";
  };

  return (
    <BoxComponent sx={{ marginTop: "50px" }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
      />
      {openDeleteModal && (
        <ModalComponent
          width={"422px"}
          open={openDeleteModal}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
          onClose={() => setOpenDeleteModal(false)}
        >
          <DeleteModals
            levelDeleteHandler={handleDelete}
            isDeleteLoader={isLoading}
            setOpenDeleteMOdel={setOpenDeleteModal}
            heading="Delete Document"
            description={"Are you sure that you want to delete this document?"}
          />
        </ModalComponent>
      )}
      <BankDetailLayout
        heading="Add documents"
        isFullHeight
        activeStep={0}
        createCampaign={createCampaign}
      >
        <>
          <BoxComponent
            sx={{
              width: "100%",
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                height: "6px",
                backgroundColor: "#F8F8F8F8",
                cursor: "pointer",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#E9E9EB",
                cursor: "pointer",
                borderRadius: "20px",
                border: "2px solid #F0F0F0",
              },
              "&::-webkit-scrollbar-button": {
                display: "none",
              },
            }}
          >
            <Table>
              <thead>
                <TableHeadRow>
                  {headers.map((header, idx) => (
                    <td
                      key={idx}
                      style={{
                        padding: "16px 8px",
                        border: "1px solid #F7F7FF",
                        borderTop: "0px",
                        minWidth: [
                          "details",
                          "documentName",
                          "createdAt",
                        ].includes(header.key)
                          ? "300px"
                          : "auto",
                      }}
                    >
                      <BoxComponent
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        {header.label}
                      </BoxComponent>
                    </td>
                  ))}
                </TableHeadRow>
              </thead>
              <tbody style={{ boxSizing: "border-box" }}>
                {isLoadingDocumentTypes ? (
                  renderDocumentTypesSkeleton()
                ) : documentTypes && documentTypes.length > 0 ? (
                  documentTypes.map((docType) => {
                    const uploadedDoc = getDocumentForType(docType._id);
                    return (
                      <TableHRow key={docType._id}>
                        <TableCell fontWeight={500}>
                          {docType.name}
                          {isDocumentRequired(docType.name) && (
                            <span style={{ color: "red", marginLeft: "4px" }}>
                              *
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {uploadedDoc
                            ? `${getStatus(uploadedDoc?.status)}`
                            : "Not Uploaded"}
                        </TableCell>
                        <TableCell>
                          {uploadedDoc
                            ? formatDate(uploadedDoc.createdAt)
                            : "-"}
                        </TableCell>
                        <TableCell color="#090909" maxWidth={"170px"}>
                          {uploadedDoc ? (
                            <Stack direction="row" spacing={1}>
                              <CardButtonWrapper>
                                <ButtonComp
                                  padding="10px 19px"
                                  height="34px"
                                  sx={{ width: "60px" }}
                                  variant={"outlined"}
                                  size="normal"
                                  onClick={() => handleFileSelect(docType)}
                                  disabled={uploadedDoc?.status === "approved"}
                                >
                                  Edit
                                </ButtonComp>
                                <ButtonComp
                                  padding="10px 19px"
                                  height="34px"
                                  sx={{ width: "60px" }}
                                  variant={"outlined"}
                                  size="normal"
                                  onClick={() => {
                                    if (uploadedDoc.documentURL) {
                                      window.open(
                                        uploadedDoc.documentURL,
                                        "_blank",
                                        "noopener,noreferrer",
                                      );
                                    }
                                    if (uploadedDoc.documentURLs) {
                                      uploadedDoc.documentURLs.forEach(
                                        (url) => {
                                          window.open(
                                            url,
                                            "_blank",
                                            "noopener,noreferrer",
                                          );
                                        },
                                      );
                                    }
                                  }}
                                >
                                  View
                                </ButtonComp>
                                <ButtonComp
                                  padding="10px 19px"
                                  height="34px"
                                  sx={{ width: "73px" }}
                                  size="normal"
                                  variant={"outlined"}
                                  onClick={() => {
                                    setDeleteId(uploadedDoc._id);
                                    setOpenDeleteModal(true);
                                  }}
                                  disabled={uploadedDoc?.status === "approved"}
                                >
                                  Delete
                                </ButtonComp>
                              </CardButtonWrapper>
                              <CardIconButtonWrapper>
                                <ButtonComp
                                  variant="outlined"
                                  size="normal"
                                  height="34px"
                                  sx={{ width: "48px" }}
                                  padding="6px 15px"
                                  onClick={() => handleFileSelect(docType)}
                                  disabled={uploadedDoc?.status === "approved"}
                                >
                                  <UploadIcon
                                    disabled={
                                      uploadedDoc?.status === "approved"
                                    }
                                  />
                                </ButtonComp>
                                <ButtonComp
                                  variant="outlined"
                                  size="normal"
                                  height="34px"
                                  sx={{ width: "48px" }}
                                  padding="6px 15px"
                                  onClick={() => {
                                    if (uploadedDoc.documentURL) {
                                      window.open(
                                        uploadedDoc.documentURL,
                                        "_blank",
                                        "noopener,noreferrer",
                                      );
                                    }
                                    if (uploadedDoc.documentURLs) {
                                      uploadedDoc.documentURLs.forEach(
                                        (url) => {
                                          window.open(
                                            url,
                                            "_blank",
                                            "noopener,noreferrer",
                                          );
                                        },
                                      );
                                    }
                                  }}
                                >
                                  <RemoveRedEyeOutlinedIcon />
                                </ButtonComp>
                                <ButtonComp
                                  variant={"outlined"}
                                  size="normal"
                                  height="34px"
                                  sx={{ width: "48px" }}
                                  padding={("6px", "15px")}
                                  onClick={() => {
                                    setDeleteId(uploadedDoc._id);
                                    setOpenDeleteModal(true);
                                  }}
                                  disabled={uploadedDoc?.status === "approved"}
                                >
                                  <DeleteIcon
                                    disabled={
                                      uploadedDoc?.status === "approved"
                                    }
                                  />
                                </ButtonComp>
                              </CardIconButtonWrapper>
                            </Stack>
                          ) : (
                            <Stack direction="row" spacing={1}>
                              <CardButtonWrapper>
                                <ButtonComp
                                  padding="10px 19px"
                                  height="34px"
                                  sx={{ width: "60px" }}
                                  variant={"outlined"}
                                  size="normal"
                                  onClick={() => handleFileSelect(docType)}
                                >
                                  Upload
                                </ButtonComp>
                              </CardButtonWrapper>
                              <CardIconButtonWrapper>
                                <ButtonComp
                                  variant="outlined"
                                  size="normal"
                                  height="34px"
                                  sx={{ width: "48px" }}
                                  padding="6px 15px"
                                  onClick={() => handleFileSelect(docType)}
                                >
                                  <UploadIcon />
                                </ButtonComp>
                              </CardIconButtonWrapper>
                            </Stack>
                          )}
                        </TableCell>
                      </TableHRow>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      <EmptyTable
                        heading="No Document Types Available"
                        description="Please wait while we load the document types"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </BoxComponent>

          <BoxComponent
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
          >
            <ButtonComp
              padding="10px 24px"
              height="40px"
              variant="contained"
              size="large"
              onClick={handleSubmitForApproval}
              disabled={isSubmitButtonDisabled}
            >
              {getContinueText()}
            </ButtonComp>
          </BoxComponent>
        </>
      </BankDetailLayout>
    </BoxComponent>
  );
};

export default AddDocumentsUI;
