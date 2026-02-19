
"use client";
import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import PropTypes from "prop-types";
import ImageUploader from "quill-image-uploader";
import htmlEditButton from "quill-html-edit-button";
import MobileImageResize from "@ammarkhalidfarooq/quill-image-resize-module-react-fix-for-mobile";
Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/mobileImageResize", MobileImageResize);
Quill.register({
  "modules/htmlEditButton": htmlEditButton,
});
import "quill/dist/quill.snow.css";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
// import { AutoFixHighOutlined } from "@mui/icons-material";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import axios from "axios";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { addCustomIcons } from "./icons";
// import IconButtonComp from "@/components/atoms/buttonComponent/IconButtonComp";
import ModalComponent from "../modal/ModalComponent";
import AiModal from "./AiModal";
import { useSelector } from "react-redux";
import {
  CAMPAIGN_STORY_IMAGE_S3,
  IMAGE_COMPRESSION_OPTIONS,
} from "@/config/constant";
import { getTextLengthWithoutHTML } from "@/utils/helpers";
import uploadFileService from "@/utils/uploadFileService";

const QuillEditor = ({
  textEditorHandler,
  editorData = "<div></div>",
  height = "200px",
  placeholder = "",
  title,
  setEditorError,
}) => {
  const [aiContentReady, setAiContentReady] = useState(false);

  const answers = useSelector((state) => state.campaign.answers);
  const campaignTitle = useSelector(
    (state) => state.campaign.campaignValues.title
  );
  const [openModal, setOpenModal] = useState(false);

  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const titleRef = useRef(title);
  const [content, setContent] = useState();

  addCustomIcons(Quill);

  // const handleUploadClick = async (fileExtension, fileData) => {
  //   const res = await uploadFileService(
  //     CAMPAIGN_STORY_IMAGE_S3,
  //     fileExtension,
  //     fileData
  //   );

  //   const { success, imageUrl } = res;
  // };

  const imageHandler = async (file) => {
    try {
      const compressedFile = await imageCompression(
        file,
        IMAGE_COMPRESSION_OPTIONS
      );
      const readerForUpload = new FileReader();
      readerForUpload.readAsArrayBuffer(compressedFile);

      return new Promise((resolve, reject) => {
        readerForUpload.onloadend = async () => {
          try {
            const lastDotIndex = compressedFile.name.lastIndexOf(".");
            const fileExtension = compressedFile.name.substring(
              lastDotIndex + 1
            );
            const res = await uploadFileService(
              CAMPAIGN_STORY_IMAGE_S3,
              fileExtension,
              readerForUpload.result
            );

            const { success, imageUrl } = res;

            if (success && imageUrl) {
              resolve(imageUrl);
            } else {
              console.error("Image upload failed");
              reject("Upload failed: No image URL returned");
            }
          } catch (error) {
            console.error("Error in upload process:", error);
            reject("Upload failed: " + (error.message || "Unknown error"));
          }
        };

        readerForUpload.onerror = () => {
          reject("Error reading file");
        };
      });
    } catch (error) {
      toast.error(error.message || "Image compression failed");
      throw error;
    }
  };

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    if (quillInstance.current && aiContentReady) {
      quillInstance.current.setText("");
      quillInstance.current.clipboard.dangerouslyPasteHTML(0, editorData);
    }
  }, [aiContentReady]);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          mobileImageResize: {
            modules: ["Resize", "DisplaySize"],
            handleStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white",
            },
          },
          toolbar: [
            ["bold"],
            ["italic"],
            ["video"],
            ["image"],
            ["link"],
            [{ list: "bullet" }],
            [{ align: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["htmlEditButton"],
          ],
          htmlEditButton: { debug: true, msg: "HTML ", okText: "Save" },
          imageUploader: {
            upload: imageHandler,
          },
        },
      });
      const toolbar = quillInstance.current.getModule("toolbar");
      const buttonContainer = document?.createElement("span");
      buttonContainer.className = "ql-custom-button";
      // buttonContainer.innerHTML = "<div id=`ai-icon-container`></div>";
      toolbar.container.appendChild(buttonContainer);

      if (editorData && quillInstance.current) {
        quillInstance.current.clipboard.dangerouslyPasteHTML(editorData);
        window.scrollTo(0, 0);
        const length = quillInstance.current.getLength();
        quillInstance.current.setSelection(length, length);
        unfocusEditor();
      }

      quillInstance.current.on("text-change", () => {
        let editorDataRefContent =
          quillInstance?.current?.root?.innerHTML || "";
        
        // Unescape HTML content if it was escaped by the HTML editor
        editorDataRefContent = editorDataRefContent
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, '\\');
        
        setContent(editorDataRefContent);
        const maxLength = 50000;

        if (getTextLengthWithoutHTML(editorDataRefContent) > maxLength) {
          setEditorError(true);
        } else {
          setEditorError(false);
        }
      });

      quillInstance.current.clipboard.addMatcher(
        Node.ELEMENT_NODE,
        (node, delta) => {
          if (node.tagName === "IMG" && node.src.startsWith("data:")) {
            const range = quillInstance.current.getSelection(true);
            if (range) {
              const toastId = toast.loading("Uploading image...");
              const base64Data = node.src.split(",")[1];
              const blob = base64ToBlob(base64Data, "image/png");
              const file = new File([blob], "pasted_image.png", {
                type: "image/png",
              });

              imageHandler(file)
                .then((imageUrl) => {
                  toast.success("Image uploaded!", { id: toastId });
                  if (range) {
                    quillInstance.current.deleteText(range.index, 1);
                    quillInstance.current.insertEmbed(
                      range.index,
                      "image",
                      imageUrl,
                    );
                    quillInstance.current.setSelection(range.index + 1);
                  }
                })
                .catch((error) => {
                  toast.error("Image upload failed.", { id: toastId });
                  console.error("Image upload error:", error);
                });
            }
            return { ops: [] };
          }
          return delta;
        },
      );
    }
  }, [editorData, placeholder, setEditorError]);

  const base64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const unfocusEditor = () => {
    if (quillInstance?.current) {
      quillInstance?.current?.blur();
    }
  };

  useEffect(() => {
    if (content != undefined) {
      textEditorHandler(content);
    }
  }, [content]);

  const questionsAndAnswers = [
    {
      question:
        "What is the main goal of your campaign, and what key appeal or unique aspect would resonate with donors?",
      answer: answers.title1,
    },
    {
      question:
        "What problem does supporting your campaign solve for the donor, and why should the donor feel compelled to act now?",
      answer: answers.title2,
    },
    {
      question:
        "How is the problem affecting individuals or communities you are helping, and what emotional or social benefits might donors experience by contributing?",
      answer: answers.title3,
    },
    {
      question:
        "What solution is your campaign offering to the problem, and how does supporting the campaign benefit the donor besides helping the beneficiaries?",
      answer: answers.title4,
    },
    {
      question:
        "Can you share a success story from your past initiatives, highlighting how donors contributed to that success?",
      answer: answers.title5,
    },
    {
      question:
        "How long has your organization been active in this field, and what recognition or endorsements have you received? How does your organization engage with and acknowledge donors?",
      answer: answers.title6,
    },
    {
      question:
        "Are there compelling personal stories showing the impact of your work that connect with potential donors' values or experiences?",
      answer: answers.title7,
    },
    {
      question:
        "Are there endorsements or significant support figures you can share? How can donors become part of a community or movement by contributing to your campaign?",
      answer: answers.title8,
    },
    {
      question:
        "What are some key points about your organization's mission, values, and experience, and how does your organization ensure transparency and show donors the direct impact of their contributions?",
      answer: answers.title9,
    },
  ];

  const filteredQuestionsAndAnswers = questionsAndAnswers
    .filter((qa) => qa.answer && qa.answer.trim().length > 0)
    .map((qa) => `Question: '${qa.question}',\nAnswer: '${qa.answer}',`)
    .join("\n");

  const prompt = `Please generate content for a campaign story focusing on a charity initiative with proper HTML tags having the title attached at the end. The content should be based on the following questions and explain how people can be involved. Avoid using the headline "Charity campaign" in the story. Instead, use engaging and descriptive language to draw readers in and convey the importance of the cause. Ensure that the generated content does not include redundant or repetitive headlines.
  2. <h2>Purpose of the Campaign</h2>

  3. <h2>Impact of the Campaign</h2>

  4. <h2>How People Can Get Involved</h2>

  5. <h3>Conclusion</h3>

  Ensure that each section is clearly distinct and and generate content for the above sections based on the following questions:
  ${filteredQuestionsAndAnswers}.

    Campaign Details:
  • Title: ${campaignTitle};

  `;

  const handleAiDescription = async () => {
    setAiContentReady(false);
    const toastId = toast.loading("Generating description from AI");
    // const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const endpoint = "https://api.openai.com/v1/chat/completions";

    try {
      const response = await axios.post(
        endpoint,
        {
          model: "gpt-4", // Specify the model
          messages: [
            {
              role: "system",
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 1,
        },
        // {
        //   headers: {
        //     Authorization: `Bearer ${apiKey}`,
        //     "Content-Type": "application/json",
        //   },
        // }
      );
      toast.dismiss(toastId);
      toast.success("Description generated.");
      setAiContentReady(true);
      textEditorHandler(response.data.choices[0].message.content);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error generating description:", error);
    }
    toast.dismiss(toastId);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <BoxComponent sx={{ position: "relative", height }}>
          <div ref={editorRef} />
        </BoxComponent>
        {/* <IconButtonComp
          sx={{
            position: "absolute",
            left: { xs: "155px", sm: "455px" },
            bottom: { xs: "-68px", sm: "-37px" },
            zIndex: 10,
          }}
          onClick={() => setOpenModal(true)}
        >
          <AutoFixHighOutlined fontSize="small" />
        </IconButtonComp> */}
      </div>
      {openModal && (
        <ModalComponent
          open={openModal}
          onClose={() => setOpenModal(false)}
          width={"612px"}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
          containerStyleOverrides={{
            maxHeight: "92vh",
            overflowY: "auto",
            "::-webkit-scrollbar": {
              width: "0px",
              background: "transparent",
            },
            "::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "::-webkit-scrollbar-thumb": {
              background: "transparent",
            },
          }}
        >
          <AiModal
            setOpenModal={setOpenModal}
            submitHandler={handleAiDescription}
          />
        </ModalComponent>
      )}
    </>
  );
};

QuillEditor.propTypes = {
  editorData: PropTypes.string.isRequired,
  height: PropTypes.string,
  placeholder: PropTypes.string,
  textEditorHandler: PropTypes.func.isRequired,
  title: PropTypes.any,
};
export default QuillEditor;
