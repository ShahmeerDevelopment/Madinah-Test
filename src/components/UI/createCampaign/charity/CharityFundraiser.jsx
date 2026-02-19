"use client";

import React, { useEffect, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { useDispatch, useSelector } from "react-redux";
import { EmailShareButton } from "react-share";
import { SHARE_TITLE, SHARE_URL } from "@/config/constant";
import {
  campaignStepperIncrementHandler,
  createCampaignHandler,
} from "@/store/slices/campaignSlice";
import { WrapperLayout } from "../createCampaign.style";
import BackButton from "@/components/atoms/createCampaigns/BackButton";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import PopOver from "@/components/molecules/popOver/PopOver";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import SearchIcon from "@/assets/iconComponent/SearchIcon";
import CharitySkeleton from "./CharitySkeleton";
import SelectAbleFieldComp from "@/components/atoms/selectAbleField/SelectAbleFieldComp";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import { Paragraph } from "@/components/atoms/limitedParagraph/LimitedParagraph.style";
import { getCharityList } from "@/api";
import { theme } from "@/config/customTheme";

const ShareEmail = React.memo(() => {
  return (
    <EmailShareButton
      url={SHARE_URL}
      subject={SHARE_TITLE}
      body="body"
      className="Demo__some-network__share-button"
    >
      Let us know!
    </EmailShareButton>
  );
});
ShareEmail.displayName = "ShareEmail";

const CharityFundraiser = () => {
  const dispatch = useDispatch();

  const {
    selectedCharityBox,
    charityName,
    charityCountry,
    charityOrganizationId,
    searchText,
  } = useSelector((state) => state.campaign.campaignValues);

  const [list, setList] = useState([]);
  const [searchValue, setSearchValue] = useState(searchText || "");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBox, setSelectedBox] = useState(selectedCharityBox || null);
  const [selectedCharity, setSelectedCharity] = useState(
    { name: charityName, countryId: { name: charityCountry } } || null
  );

  const limit = 110;
  const offSet = 0;

  const getCharityListFromApi = async (value, limit, offSet) => {
    setIsLoading(true);
    getCharityList(value, limit, offSet)
      .then((res) => {
        const result = res?.data;
        if (result.success === true) {
          setList(result.data.charityOrganizations?.slice(0, 4));
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const charityHandler = () => {
    const payload = {
      charityName: selectedCharity?.name,
      charityCountry: selectedCharity?.countryId?.name,
      selectedCharityBox: selectedBox,
      charityOrganizationId: selectedCharity?._id,
      searchText: searchValue,
    };
    dispatch(createCampaignHandler(payload));
    dispatch(campaignStepperIncrementHandler(1));
  };

  useEffect(() => {
    const charityId = charityOrganizationId?._id;
    const index = list?.findIndex(
      (charityItem) => charityItem._id === charityId
    );
    const payload = {
      selectedCharityBox: index,
    };
    // setSelectedBox(index);
    dispatch(createCampaignHandler(payload));
  }, [list]);

  const handleBoxClick = (item, index) => {
    setSelectedBox((prevSelected) => (prevSelected === index ? null : index));
    setSelectedCharity(item);
  };

  const searchHandler = (e) => setSearchValue(e.target.value);

  const fetchMoreData = (value) => {
    getCharityListFromApi(value, limit, offSet);
  };

  useEffect(() => {
    fetchMoreData(searchValue, limit, offSet);
  }, [searchValue]);

  return (
    <WrapperLayout isFullHeight={true}>
      <BackButton />
      <BoxComponent sx={{ mt: { xs: 3, sm: 5 } }}>
        <BoxComponent
          sx={{
            display: "flex",
            justifyContent: { xs: "space-between", sm: "flex-start" },
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <CampaignHeading sx={{ letterSpacing: "-0.41px" }}>
            Discover charities, causes & organizations.
          </CampaignHeading>
          <PopOver
            maxWidth={"260px"}
            popoverContent={
              "Choose a registered charity from our list for your fundraiser. If your preferred charity is not there, click this link to request its addition."
            }
          />
        </BoxComponent>
        <TextFieldComp
          name="search"
          label={""}
          placeholder={"Find an organizations"}
          fullWidth
          value={searchValue}
          onChange={searchHandler}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  color={searchValue !== "" ? "#606062" : "#A1A1A8"}
                />
              </InputAdornment>
            ),
          }}
        />
      </BoxComponent>
      <div style={{ height: "420px" }}>
        {isLoading ? (
          <CharitySkeleton />
        ) : (
          <BoxComponent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              height: "380px",
              overflow: "hidden",
            }}
          >
            {list?.map((item, index) => (
              <SelectAbleFieldComp
                key={index}
                isCharityList={true}
                isActive={selectedBox === index}
                onClick={() => handleBoxClick(item, index)}
                heading={item?.name}
                title={item.countryId?.name}
                color={theme.palette.primary.darkGray}
              />
            ))}

            {list?.length === 0 ? (
              <BoxComponent sx={{ mt: 2 }}>
                <SubHeading>Oops! Your charity has not been found</SubHeading>
                <Paragraph>
                  Know an organization that should be on Madinah?{" "}
                  <span style={{ color: "#6363E6" }}>
                    <ShareEmail />
                  </span>
                </Paragraph>
              </BoxComponent>
            ) : null}
          </BoxComponent>
        )}
      </div>

      <SubmitButton
        withSticky
        isContinueButtonDisabled={selectedBox === null}
        onClick={charityHandler}
      >
        Continue
      </SubmitButton>
    </WrapperLayout>
  );
};

export default React.memo(CharityFundraiser);
