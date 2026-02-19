"use client";

import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { setAnswer } from "@/store/slices/campaignSlice";

const AiModal = ({ setOpenModal, submitHandler }) => {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.campaign.answers);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setAnswer({ name, value }));
  };
  const handleSubmit = () => {
    setOpenModal(false);
    submitHandler();
  };

  return (
    <BoxComponent
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <CampaignHeading>AI Campaign Story Builder</CampaignHeading>
      <TextFieldComp
        multiline={true}
        maxRows={4}
        size="small"
        label={
          "What is the main goal of your campaign, and what key appeal or unique aspect would resonate with donors?"
        }
        placeholder={"Write answer"}
        fullWidth
        name="title1"
        value={answers.title1}
        onChange={handleChange}
      />
      <TextFieldComp
        multiline={true}
        maxRows={4}
        size="small"
        label={
          "What problem does supporting your campaign solve for the donor, and why should the donor feel compelled to act now?"
        }
        placeholder={"Write answer"}
        fullWidth
        name="title2"
        value={answers.title2}
        onChange={handleChange}
      />
      <TextFieldComp
        multiline={true}
        maxRows={4}
        size="small"
        label={
          "How is the problem affecting individuals or communities you are helping, and what emotional or social benefits might donors experience by contributing?"
        }
        placeholder={"Write answer"}
        fullWidth
        name="title3"
        value={answers.title3}
        onChange={handleChange}
      />
      <TextFieldComp
        multiline={true}
        maxRows={4}
        size="small"
        label={
          "What solution is your campaign offering to the problem, and how does supporting the campaign benefit the donor besides helping the beneficiaries?"
        }
        placeholder={"Write answer"}
        fullWidth
        name="title4"
        value={answers.title4}
        onChange={handleChange}
      />
      <TextFieldComp
        multiline={true}
        maxRows={4}
        size="small"
        label={
          "Can you share a success story from your past initiatives, highlighting how donors contributed to that success?"
        }
        placeholder={"Write answer"}
        fullWidth
        name="title5"
        value={answers.title5}
        onChange={handleChange}
      />
      <TextFieldComp
        multiline={true}
        maxRows={4}
        size="small"
        label={
          "How long has your organization been active in this field, and what recognition or endorsements have you received? How does your organization engage with and acknowledge donors?"
        }
        placeholder={"Write answer"}
        fullWidth
        name="title6"
        value={answers.title6}
        onChange={handleChange}
      />
      <TextFieldComp
        multiline={true}
        maxRows={4}
        size="small"
        label={
          "Are there compelling personal stories showing the impact of your work that connect with potential donors' values or experiences?"
        }
        placeholder={"Write answer"}
        fullWidth
        name="title7"
        value={answers.title7}
        onChange={handleChange}
      />
      <TextFieldComp
        multiline={true}
        maxRows={4}
        size="small"
        label={
          "Are there endorsements or significant support figures you can share? How can donors become part of a community or movement by contributing to your campaign?"
        }
        placeholder={"Write answer"}
        fullWidth
        name="title8"
        value={answers.title8}
        onChange={handleChange}
      />
      <TextFieldComp
        multiline={true}
        maxRows={4}
        size="small"
        label={
          "What are some key points about your organization's mission, values, and experience, and how does your organization ensure transparency and show donors the direct impact of their contributions?"
        }
        placeholder={"Write answer"}
        fullWidth
        name="title9"
        value={answers.title9}
        onChange={handleChange}
      />
      <ButtonComp onClick={handleSubmit}>Submit</ButtonComp>
    </BoxComponent>
  );
};
AiModal.propTypes = {
  setOpenModal: PropTypes.func,
  submitHandler: PropTypes.func,
};
export default AiModal;
