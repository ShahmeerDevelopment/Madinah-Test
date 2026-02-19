"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import { useSelector } from "react-redux";

const AiImageModal = ({ setOpenAiModal, promptHandler }) => {
  const { campaignTitle, campaignStory } = useSelector(
    (state) => state.campaign.campaignValues,
  );

  // Helper function to remove HTML tags
  const removeHtmlTags = (text) => text.replace(/<[^>]*>/g, "");

  const INITIAL_PROMPT = `I need you to create a high-quality cover image for my crowdfunding campaign based on the content given below. on Madinah.com. The prompt should produce an image that looks natural and not AI-generated. The final image should be compelling and effectively support the campaign’s headline and story. The prompt should use best judgment to determine an appropriate and effective art style for a crowdfunding page. The prompt will be modifiable by the user in order to add direction or parameters. The prompt should include these parameters by default:

The image should avoid any gibberish text or AI-generated-looking people. Additionally, please ensure the following:
  1. Avoid any depiction of Islamic figures or religious symbols to ensure respect for Islamic guidelines.
  2. The image should be culturally sensitive and respectful, avoiding any content that could be considered inappropriate or offensive.
  3. Ensure the image aligns with the values and sensibilities of a Muslim audience.
  4. Focus on positive and uplifting visuals that support the campaign’s message and goals.
  5. The image should be professional and respectful, not sensational.
  
   Campaign Details:
  • Headline: ${campaignTitle};
  • Story: ${removeHtmlTags(campaignStory)}`;

  const [promptValue, setPromptValue] = useState(INITIAL_PROMPT);

  const promptValueHandler = (e) => setPromptValue(e.target.value);

  const submitHandler = () => {
    //   const finalPrompt = `${promptValue}

    // Campaign Details:
    // • Headline: ${campaignTitle}`;
    //   //   • Story: ${campaignStory}`;

    //   console.log(finalPrompt);
    promptHandler(promptValue);
    setOpenAiModal(false);
  };

  return (
    <BoxComponent display="flex" flexDirection="column" alignItems="center">
      <SubHeading sx={{ mb: 2 }}>AI Image Generation</SubHeading>
      <TextFieldComp
        multiline={true}
        maxRows={15}
        label={"ChatGPT prompt to generate cover photo"}
        placeholder={"Write answer"}
        fullWidth
        name="title1"
        value={promptValue}
        onChange={promptValueHandler}
      />
      <ButtonComp onClick={submitHandler}>Submit</ButtonComp>
    </BoxComponent>
  );
};

AiImageModal.propTypes = {
  setOpenAiModal: PropTypes.func,
  promptHandler: PropTypes.func,
};
export default AiImageModal;
